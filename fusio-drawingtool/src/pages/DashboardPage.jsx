// src/pages/DashboardPage.js

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setCanvases } from "../features/auth/authSlice";
import { useGetMeQuery } from "../features/auth/authSlice";
import { useGetUserCanvasesQuery } from "../features/canvas/canvasApiSlice";
import Sidebar from "../Component/Sidebar";
import TopBar from "../Component/Topbar";
import QuickActions from "../Component/QuickAction";
import FileTable from "../Component/FileTable";
import { useCreateCanvasMutation } from "../features/canvas/canvasApiSlice";
import { useNavigate } from "react-router";

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: userData, isSuccess: isUserSuccess } = useGetMeQuery();
  const { data: canvasesData, isSuccess: isCanvasesSuccess } = useGetUserCanvasesQuery();

  const [createCanvas, { isLoading }] = useCreateCanvasMutation();

  useEffect(() => {
    if (isUserSuccess) {
      dispatch(setUser(userData));
    }
  }, [isUserSuccess, userData, dispatch]);

  useEffect(() => {
    if (isCanvasesSuccess) {
      dispatch(setCanvases(canvasesData));
    }
  }, [isCanvasesSuccess, canvasesData, dispatch]);

  const handleCreateCanvas = async () => {
    if (!canvasTitle.trim()) return alert("Title is required");

    try {
      const res = await createCanvas({ title: canvasTitle }).unwrap();
      setModalOpen(false);
      setCanvasTitle("");
      navigate(`/canvas/${res.canvasId}`);
    } catch (error) {
      alert("Failed to create canvas");
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800">
        <Sidebar />
      </aside>

      <main className="flex-1 overflow-y-auto p-6 bg-black">
        <TopBar />
        <div className="mt-6 flex justify-between items-center">
          <QuickActions />
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Create New Canvas
          </button>
        </div>
        <div className="mt-10">
          <FileTable />
        </div>

        {/* Modal Popup */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-zinc-900 p-6 rounded shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Create New Canvas</h2>
              <input
                type="text"
                value={canvasTitle}
                onChange={(e) => setCanvasTitle(e.target.value)}
                placeholder="Enter canvas title"
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCanvas}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
