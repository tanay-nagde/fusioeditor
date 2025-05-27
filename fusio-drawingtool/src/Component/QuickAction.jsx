import { PlusCircle, BrainCircuit, LayoutList } from "lucide-react";

const actions = [
  {
    icon: <PlusCircle className="w-6 h-6 text-purple-400" />,
    title: "Create Blank File",
    description: "Start a new canvas from scratch.",
  },
  {
    icon: <BrainCircuit className="w-6 h-6 text-purple-400" />,
    title: "Generate AI Diagram",
    description: "Let AI draw structured diagrams for you.",
  },
  {
    icon: <LayoutList className="w-6 h-6 text-purple-400" />,
    title: "Generate AI Outline",
    description: "Get an AI-powered plan or outline.",
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action) => (
        <div
          key={action.title}
          className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="mb-3">{action.icon}</div>
          <div className="text-white font-semibold">{action.title}</div>
          <div className="text-sm text-zinc-400">{action.description}</div>
        </div>
      ))}
    </div>
  );
}
