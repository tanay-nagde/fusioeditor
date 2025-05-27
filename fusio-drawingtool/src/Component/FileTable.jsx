// src/Component/FileTable.js

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { useDeleteCanvasMutation } from "../features/canvas/canvasApiSlice";
import { removeCanvas } from "../features/auth/authSlice";

export default function FileTable() {
  const canvases = useSelector((state) => state.auth.canvases);
  const dispatch = useDispatch();
  const [deleteCanvas] = useDeleteCanvasMutation();

  const handleDelete = async (canvasId) => {
    if (!window.confirm("Are you sure you want to delete this canvas?")) return;
    try {
      await deleteCanvas(canvasId).unwrap();
      dispatch(removeCanvas(canvasId));
    } catch (err) {
      alert("Failed to delete canvas");
    }
  };

  return (
    <div className="w-full">
      <table className="w-full text-sm text-left text-zinc-300 border-collapse">
        <thead>
          <tr className="text-zinc-500 border-b border-zinc-800">
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Created</th>
            <th className="py-2 px-3">Edited</th>
            <th className="py-2 px-3">Comments</th>
            <th className="py-2 px-3">Author</th>
            <th className="py-2 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {canvases.map((canvas) => (
            <tr
              key={canvas._id}
              className="border-b border-zinc-800 hover:bg-zinc-900"
            >
              <td className="py-2 px-3">
                <Link
                  to={`/canvas/${canvas._id}`}
                  className="text-blue-400 hover:underline"
                >
                  {canvas.title}
                </Link>
              </td>
              <td className="py-2 px-3">
                {new Date(canvas.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2 px-3">
                {new Date(canvas.updatedAt).toLocaleDateString()}
              </td>
              <td className="py-2 px-3">{canvas.comments?.length || 0}</td>
              <td className="py-2 px-3">{canvas.owner?.name || "N/A"}</td>
              <td className="py-2 px-3 text-right flex justify-end space-x-2">
                <button onClick={() => handleDelete(canvas._id)}>
                  <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                </button>
                <MoreHorizontal className="w-4 h-4 text-zinc-500 hover:text-white" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
