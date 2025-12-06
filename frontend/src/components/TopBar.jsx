import { Compass } from "lucide-react";

export default function TopBar() {
  return (
    <header className="relative z-10 h-16 bg-white/70 backdrop-blur-xl border-b border-white/50 flex items-center px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Compass className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Generate Roadmap
        </h1>
      </div>
    </header>
  );
}
