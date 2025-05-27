import { FileText, FolderKanban, Bot, Sparkles, Archive, HelpCircle, Plus } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full justify-between p-4 text-sm text-zinc-200">
      {/* Top Section */}
      <div className="space-y-6">
        <div className="font-semibold text-white">Tanay ▼</div>

        <div className="space-y-2">
          <button className="flex items-center w-full gap-2 hover:bg-zinc-800 px-3 py-2 rounded">
            <FileText className="w-4 h-4" />
            All Files
          </button>

          <button className="flex items-center w-full gap-2 hover:bg-zinc-800 px-3 py-2 rounded">
            <FolderKanban className="w-4 h-4" />
            Team Folders
          </button>
        </div>

        <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
          <div className="text-xs uppercase text-zinc-500 tracking-widest">Shortcuts</div>
          <button className="flex items-center w-full gap-2 hover:bg-zinc-800 px-3 py-2 rounded">
            <Bot className="w-4 h-4" />
            Eraserbot
          </button>
          <button className="flex items-center w-full gap-2 hover:bg-zinc-800 px-3 py-2 rounded">
            <Sparkles className="w-4 h-4" />
            AI References
          </button>
        </div>

        <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
          <button className="w-full flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded">
            <Plus className="w-4 h-4" />
            New File
          </button>
          <button className="flex items-center w-full gap-2 hover:bg-zinc-800 px-3 py-2 rounded">
            <Archive className="w-4 h-4" />
            Archive
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        <button className="flex items-center w-full gap-2 hover:bg-zinc-800 px-3 py-2 rounded">
          <HelpCircle className="w-4 h-4" />
          Help
        </button>
      </div>
    </div>
  );
}
