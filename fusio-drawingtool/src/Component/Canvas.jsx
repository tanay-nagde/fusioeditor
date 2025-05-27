import React, { useEffect, useRef, useState, useCallback } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useParams, useNavigate } from "react-router";
import { io } from "socket.io-client";
import {
  useGetCanvasByIdQuery,
  useSaveCanvasDataMutation,
} from "../features/canvas/canvasApiSlice";

export default function Canvas() {
  const { canvasId } = useParams();
  const navigate = useNavigate();

  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [saveCanvas] = useSaveCanvasDataMutation();

  const socketRef = useRef(null);
  const socketIdRef = useRef(null);
  const initialElementsRef = useRef([]);

  const { data: canvasData, isSuccess, isLoading, isError } = useGetCanvasByIdQuery(canvasId);

  // Load initial canvas data
  useEffect(() => {
    if (isSuccess && canvasData?.data) {
      const fetchedElements = canvasData.data.elements || [];
      initialElementsRef.current = fetchedElements;
    }
  }, [isSuccess, canvasData]);

  // Handle changes in Excalidraw
  const handleChange = useCallback(
    (newElements) => {
      const socket = socketRef.current;
      if (!socket || !socket.connected) return;

      socket.emit("canvas-update", {
        canvasId,
        senderId: socketIdRef.current,
        elements: newElements,
      });
    },
    [canvasId]
  );

  // Save canvas to backend
  const handleSave = async () => {
    if (!excalidrawAPI) return;
    const currentElements = excalidrawAPI.getSceneElements();
    try {
      await saveCanvas({ canvasId, data: { elements: currentElements } });
      alert("Canvas saved!");
    } catch (err) {
      console.error("[Save] Failed to save canvas", err);
      alert("Failed to save canvas");
    }
  };

  const handleShare = () => {
    const randomSlug = Math.random().toString(36).slice(2, 10);
    navigate(`/canvas/${randomSlug}`);
  };

  if (isLoading) return <div className="text-white p-4">Loading...</div>;
  if (isError) return <div className="text-red-500 p-4">Failed to load canvas.</div>;

  return (
    <div className="h-full w-full bg-zinc-950 p-4 overflow-hidden rounded-lg shadow-xl flex flex-col">
      <div className="flex gap-2 mb-2">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Save Canvas
        </button>
        <button
          onClick={handleShare}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Share (New Room)
        </button>
      </div>

      <div className="flex-grow border border-zinc-800 rounded-md overflow-hidden">
        <Excalidraw
          excalidrawAPI={setExcalidrawAPI}
          onChange={(elements, appState) => handleChange(elements)}
          initialData={{
            elements: initialElementsRef.current,
        
            scrollToContent: true,
          }}
          isCollaborating={true}
          theme="dark"
        />
      </div>
    </div>
  );
}
