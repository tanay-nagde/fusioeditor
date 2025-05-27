import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import {
  Sparkles,
  Users,
  PenTool,
  Share2,
  Clock,
  Cloud,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="flex justify-center">
            <Sparkles className="h-12 w-12 text-purple-400 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Real-Time Collaborative Canvas
          </h1>
          <p className="text-lg text-gray-400">
            Build, brainstorm, and collaborate in real-time — just like Excalidraw or Eraser.
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl shadow-xl transition-all"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="px-6 py-20 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <Feature
            icon={<Users className="h-10 w-10 text-purple-400 mb-4" />}
            title="Live Collaboration"
            desc="Work with your team in real-time. See their cursors and updates as they happen."
          />
          <Feature
            icon={<PenTool className="h-10 w-10 text-purple-400 mb-4" />}
            title="Smooth Drawing Tools"
            desc="Draw freely with precision — from shapes to freehand lines, it's all instant."
          />
          <Feature
            icon={<Share2 className="h-10 w-10 text-purple-400 mb-4" />}
            title="Easy Sharing"
            desc="Share your canvas instantly with a link. No login required for guests."
          />
          <Feature
            icon={<Clock className="h-10 w-10 text-purple-400 mb-4" />}
            title="Version History"
            desc="Rewind your work with real-time history and change tracking."
          />
          <Feature
            icon={<Cloud className="h-10 w-10 text-purple-400 mb-4" />}
            title="Cloud-Synced"
            desc="Every stroke is saved instantly and securely in the cloud."
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center bg-zinc-900">
        <h2 className="text-3xl font-semibold mb-6">Ready to collaborate?</h2>
        <Button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl shadow-xl transition-all"
        >
          Launch the Canvas
        </Button>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-zinc-800 p-6 rounded-2xl shadow hover:shadow-lg transition-all">
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
