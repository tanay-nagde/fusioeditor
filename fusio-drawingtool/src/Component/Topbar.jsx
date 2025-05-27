import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TopBar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        {["All", "Recents", "Created by Me"].map((tab) => (
          <button
            key={tab}
            className="text-sm text-zinc-300 hover:text-white px-3 py-2 rounded hover:bg-zinc-800"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <Input
          type="text"
          placeholder="Search files..."
          className="bg-zinc-900 text-sm border border-zinc-800 text-white"
        />
        <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm">
          Invite
        </Button>
      </div>
    </div>
  );
}
