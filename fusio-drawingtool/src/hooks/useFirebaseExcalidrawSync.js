import { useState, useEffect, useRef, useCallback } from 'react';
import { ref, get, onValue, runTransaction } from 'firebase/database';
import {
  convertToExcalidrawElements,
} from '@excalidraw/excalidraw';
import {
  debounce,
  removeUndefinedRecursively,
  elementsArraysAreEqual,
} from '../utils/excalidrawUtils';
import { db } from '../../firebase';

const CURRENT_USER_ID = `user-${Math.random().toString(36).substring(2, 9)}`;
console.log(`Current User ID for testing: ${CURRENT_USER_ID}`);

export function useFirebaseExcalidrawSync(docId, excalidrawAPI) {
  const [initialElements, setInitialElements] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const isRemoteUpdate = useRef(false);

  const debouncedSave = useCallback(
    debounce(async (elementsToSave) => {
      if (!excalidrawAPI) {
        console.warn('📝 debouncedSave: Excalidraw API not ready for save.');
        return;
      }
      const canvasRef = ref(db, `canvases/${docId}`);

      try {
        console.log('📝 debouncedSave: Initiating transaction...');
        await runTransaction(canvasRef, (currentData) => {
          console.log('🔄 runTransaction: Inside transaction callback.');

          const lastUpdatedBy = currentData?.lastUpdatedBy;
          // Log raw data from currentData before conversion
          console.log('📝 debouncedSave: Raw currentDbElements from Firebase:', currentData?.elements ? JSON.stringify(currentData.elements).substring(0, 200) + '...' : 'No elements');
          const currentDbElements = convertToExcalidrawElements(currentData?.elements);
          console.log('📝 debouncedSave: currentDbElements after convertToExcalidrawElements:', JSON.stringify(currentDbElements).substring(0, 200) + '...');


          console.log('📝 debouncedSave: Elements from Excalidraw (before cleaning):', JSON.stringify(elementsToSave).substring(0, 200) + '...');
          const cleanedElementsToSave = removeUndefinedRecursively(elementsToSave, 'localElementsForSave');

          console.log('📝 debouncedSave: Current DB elements (before cleaning):', JSON.stringify(currentDbElements).substring(0, 200) + '...');
          const cleanedCurrentDbElements = removeUndefinedRecursively(currentDbElements, 'dbElementsForComparison');

          if (lastUpdatedBy === CURRENT_USER_ID && elementsArraysAreEqual(cleanedElementsToSave, cleanedCurrentDbElements)) {
            console.log('🚫 runTransaction: Skipping save. Last update was by current user and elements are identical.');
            return;
          }

          console.log('🔄 runTransaction: Current data from DB (first 100 chars):', JSON.stringify(cleanedCurrentDbElements).substring(0, 100) + '...');
          console.log('🔄 runTransaction: Local elements to save (first 100 chars):', JSON.stringify(cleanedElementsToSave).substring(0, 100) + '...');

          return {
            elements: cleanedElementsToSave,
            updatedAt: Date.now(),
            lastUpdatedBy: CURRENT_USER_ID,
          };
        });
        console.log('✅ debouncedSave: Transaction completed (or aborted if identical).');
      } catch (error) {
        console.error("❌ Transaction failed:", error);
      }
    }, 1000),
    [excalidrawAPI, docId]
  );

  const triggerSave = useCallback((elements) => {
    if (!isRemoteUpdate.current) {
      console.log('📝 triggerSave: Local change detected, scheduling save.');
      debouncedSave(elements);
    } else {
      console.log('📝 triggerSave: Skipping save, update originated remotely.');
    }
  }, [debouncedSave]);

  useEffect(() => {
    const canvasRef = ref(db, `canvases/${docId}`);

    const fetchInitialData = async () => {
      try {
        const snapshot = await get(canvasRef);
        let elements;
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Log the raw data coming directly from Firebase
          console.log('🌐 fetchInitialData: Raw data from Firebase (full):', JSON.stringify(data.elements, null, 2));

          elements = convertToExcalidrawElements(data.elements);
          // Log the elements AFTER convertToExcalidrawElements, BEFORE our cleaning
          console.log('🌐 fetchInitialData: Elements AFTER convertToExcalidrawElements (full):', JSON.stringify(elements, null, 2));

          // **Spot check for freedraw elements specifically**
          elements.forEach((el, index) => {
            if (el.type === 'freedraw') {
              console.log(`🔍 Freedraw element at index ${index} (before cleaning):`);
              console.log(`  ID: ${el.id}`);
              console.log(`  Points:`, el.points);
              console.log(`  Pressures:`, el.pressures);
              console.log(`  Stroke Color:`, el.strokeColor);
              // Add any other properties you suspect could be problematic
            }
          });

        } else {
          console.log('🌐 fetchInitialData: No initial data found, starting with empty canvas.');
          elements = [];
        }
        const cleanedElements = removeUndefinedRecursively(elements, 'initialLoad');
        console.log('🌐 fetchInitialData: Initial elements for Excalidraw (after *our* cleaning, full):', JSON.stringify(cleanedElements, null, 2));
        setInitialElements(cleanedElements);
      } catch (error) {
        console.error("❌ Error fetching initial data:", error);
        setInitialElements([]);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchInitialData();

    const unsubscribe = onValue(canvasRef, (snapshot) => {
      console.log('🌐 onValue: Firebase data changed event received.');
      if (!excalidrawAPI) {
        console.log('🌐 onValue: Excalidraw API not ready, skipping update from Firebase.');
        return;
      }

      const data = snapshot.val();
      const remoteLastUpdatedBy = data?.lastUpdatedBy;
      console.log(`🌐 onValue: Remote lastUpdatedBy: ${remoteLastUpdatedBy}, Current User ID: ${CURRENT_USER_ID}`);

      if (remoteLastUpdatedBy === CURRENT_USER_ID) {
        console.log('🌐 onValue: Remote update originated from current user. Skipping Excalidraw scene update.');
        isRemoteUpdate.current = false;
        return;
      }

      let remoteElements;
      if (data) {
        // Log raw remote data
        console.log('🌐 onValue: Raw remote elements from Firebase (full):', JSON.stringify(data.elements, null, 2));
        remoteElements = convertToExcalidrawElements(data.elements);
        // Log converted remote elements before our cleaning
        console.log('🌐 onValue: Remote elements AFTER convertToExcalidrawElements (full):', JSON.stringify(remoteElements, null, 2));

         // **Spot check for freedraw elements specifically**
        remoteElements.forEach((el, index) => {
          if (el.type === 'freedraw') {
            console.log(`🔍 Remote Freedraw element at index ${index} (before cleaning):`);
            console.log(`  ID: ${el.id}`);
            console.log(`  Points:`, el.points);
            console.log(`  Pressures:`, el.pressures);
            console.log(`  Stroke Color:`, el.strokeColor);
            // Add any other properties you suspect could be problematic
          }
        });

      } else {
        console.log('🌐 onValue: No data in snapshot (e.g., document deleted).');
        remoteElements = [];
      }

      const cleanedRemoteElements = removeUndefinedRecursively(remoteElements, 'remoteUpdate');
      console.log('🌐 onValue: Remote elements for Excalidraw scene (after *our* cleaning, full):', JSON.stringify(cleanedRemoteElements, null, 2));

      isRemoteUpdate.current = true;
      try {
        excalidrawAPI.updateScene({
          elements: cleanedRemoteElements,
        });
        console.log('🌐 onValue: Remote elements successfully updated in Excalidraw scene.');
      } catch (updateError) {
        console.error('❌ Error updating Excalidraw scene with remote elements:', updateError);
        console.error('Problematic elements leading to crash (FULL DATA):', JSON.stringify(cleanedRemoteElements, null, 2));
      } finally {
        isRemoteUpdate.current = false;
      }
    });

    return () => {
      console.log('🌐 onValue: Unsubscribing from Firebase listener.');
      unsubscribe();
    };
  }, [docId, excalidrawAPI]);

  return { initialElements, isInitializing, isRemoteUpdate, triggerSave };
}