/* -------------------------------------
  🧹 Debounce utility
-------------------------------------- */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* -------------------------------------
  🔬 Robust Deep Equality Comparison (order-insensitive for objects)
-------------------------------------- */
function areObjectsEqual(obj1, obj2) {
  if (obj1 === obj2) return true; // Same object reference or primitive values

  if (obj1 == null || typeof obj1 != "object" ||
    obj2 == null || typeof obj2 != "object") {
    return false; // One is null/not object, or different types
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  // Check all keys from obj1
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

function deepEqual(val1, val2) {
  if (val1 === val2) return true; // Primitive equality or same object reference

  if (val1 == null || typeof val1 != "object" ||
    val2 == null || typeof val2 != "object") {
    return false; // One is null/not object, or different types
  }

  // Handle arrays
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (val1.length !== val2.length) {
      console.log('🚨 deepEqual: Array lengths differ:', val1.length, val2.length);
      return false;
    }
    for (let i = 0; i < val1.length; i++) {
      if (!deepEqual(val1[i], val2[i])) {
        console.log('🚨 deepEqual: Array element differs at index', i);
        return false;
      }
    }
    return true;
  }

  // Handle objects (not arrays)
  if (!Array.isArray(val1) && !Array.isArray(val2)) {
    return areObjectsEqual(val1, val2);
  }

  // If one is array and other is not, or other type mismatch
  console.log('🚨 deepEqual: Type mismatch (one array, one not, or other type issue).', typeof val1, typeof val2);
  return false;
}


/* -------------------------------------
  🧽 Recursively clean Excalidraw elements for consistency.
  - Removes properties with 'undefined' values.
  - Ensures common array properties (like 'points', 'boundElements') are
    always arrays, even if empty, preventing 'length' errors.
  - Converts null to undefined for filtering purposes, except for specific
    Excalidraw array properties that should become empty arrays.
-------------------------------------- */
export const removeUndefinedRecursively = (input, path = 'root') => {
  if (Array.isArray(input)) {
    console.log(`🧹 Cleaning array at path: ${path} (length: ${input.length})`);
    const cleanedArray = input.map((item, index) => {
      const cleanedItem = removeUndefinedRecursively(item, `${path}[${index}]`);
      if (cleanedItem === undefined) {
        console.log(`🧹 Item at ${path}[${index}] became undefined, filtering out.`);
      }
      return cleanedItem;
    }).filter(item => item !== undefined);
    console.log(`🧹 Array at path: ${path} cleaned. New length: ${cleanedArray.length}`);
    return cleanedArray;
  }

  if (input && typeof input === 'object') {
    console.log(`🧹 Cleaning object at path: ${path}`);
    const result = {};
    for (const [key, value] of Object.entries(input)) {
      const currentPath = `${path}.${key}`;
      if (value === undefined) {
        console.log(`🧹 Property at ${currentPath} is undefined, skipping.`);
        continue;
      }

      const mustBeArrayKeys = ['points', 'boundElements', 'groupIds', 'start', 'end', 'startBinding', 'endBinding']; // Added common array keys
      if (mustBeArrayKeys.includes(key)) {
        console.log(`🧹 Handling critical array property: ${currentPath}. Current value type: ${typeof value}. Is array: ${Array.isArray(value)}`);
        if (value === null || value === undefined) {
          console.log(`🧹 ${currentPath} was null/undefined, setting to empty array.`);
          result[key] = [];
        } else if (!Array.isArray(value)) {
          // This is a critical warning: if it's supposed to be an array but isn't
          console.warn(`🚨 ${currentPath} was expected to be an array but is not! Type: ${typeof value}, Value:`, value);
          result[key] = []; // Force to empty array to prevent crash
        } else {
          result[key] = value; // Keep the original array if it's already an array
        }

        // Always recursively clean the contents of the array
        result[key] = result[key].map(item => removeUndefinedRecursively(item, `${currentPath}[]`)).filter(item => item !== undefined);
        continue; // Move to the next key after handling
      }

      // For all other properties, if the value is null, treat it as undefined for pruning purposes
      const cleanedValue = value === null ? undefined : removeUndefinedRecursively(value, currentPath);

      if (cleanedValue !== undefined) {
        result[key] = cleanedValue;
      } else {
        console.log(`🧹 Property at ${currentPath} became undefined after recursive cleaning, skipping.`);
      }
    }
    if (Object.keys(result).length === 0) {
      console.log(`🧹 Object at ${path} became empty after cleaning, returning undefined.`);
      return undefined;
    }
    console.log(`🧹 Object at ${path} cleaned.`);
    return result;
  }

  // Primitive values or unknown types are returned as is
  console.log(`🧹 Returning primitive value at path: ${path}. Value:`, input);
  return input;
};


/* -------------------------------------
  🔄 Merge elements by their unique IDs (local changes take priority)
  This is crucial for conflict resolution during Firebase transactions.
-------------------------------------- */
export const mergeElements = (remote = [], local = []) => {
  const mergedMap = new Map();

  // Add all remote elements first
  for (const el of remote) {
    mergedMap.set(el.id, el);
  }

  // Overwrite with local elements (local changes take priority for existing IDs)
  for (const el of local) {
    mergedMap.set(el.id, el);
  }

  // Return merged elements array
  return Array.from(mergedMap.values());
};

/* -------------------------------------
  ⚙️ Deep compare two Excalidraw elements arrays by id and content.
  It applies `removeUndefinedRecursively` to ensure elements are consistently structured
  (e.g., no `undefined` properties, critical arrays are always arrays) before comparison.
-------------------------------------- */
export const elementsArraysAreEqual = (arr1 = [], arr2 = []) => {
  // Apply the cleaning function to ensure consistent structure for comparison.
  console.log('🔄 elementsArraysAreEqual: Cleaning and comparing arrays.');
  const cleanedArr1 = removeUndefinedRecursively(arr1, 'array1');
  const cleanedArr2 = removeUndefinedRecursively(arr2, 'array2');

  if (cleanedArr1.length !== cleanedArr2.length) {
    console.log('elementsArraysAreEqual: Lengths differ.', cleanedArr1.length, cleanedArr2.length);
    return false;
  }

  const sortedArr1 = [...cleanedArr1].sort((a, b) => a.id.localeCompare(b.id));
  const sortedArr2 = [...cleanedArr2].sort((a, b) => a.id.localeCompare(b.id));


  for (let i = 0; i < sortedArr1.length; i++) {
    const el1 = sortedArr1[i];
    const el2 = sortedArr2[i];

    if (el1.id !== el2.id) {
      console.log(`elementsArraysAreEqual: IDs at index ${i} differ: ${el1.id} vs ${el2.id}`);
      return false;
    }

    if (!deepEqual(el1, el2)) {
      console.log(`elementsArraysAreEqual: Full element content differs for ID: ${el1.id}`);
      // Log the differing elements for detailed inspection
      console.log('elementsArraysAreEqual: Element 1 (cleaned):', JSON.stringify(el1, null, 2));
      console.log('elementsArraysAreEqual: Element 2 (cleaned):', JSON.stringify(el2, null, 2));
      return false;
    }
  }
  console.log('elementsArraysAreEqual: Arrays are deeply equal after cleaning.');
  return true;
};