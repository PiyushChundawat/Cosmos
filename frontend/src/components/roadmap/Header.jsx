import { BookOpen, Share2, Download, MoreHorizontal } from "lucide-react";

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      
      {/* Left Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <BookOpen className="w-5 h-5 text-white" />
        </div>

        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            My Learning Roadmap
          </h1>
          <p className="text-xs text-gray-500">Web Development Path</p>
        </div>
      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-2">
        <button className="p-2.5 rounded-xl hover:bg-gray-100 transition">
          <Share2 className="w-5 h-5 text-gray-600" />
        </button>

        <button className="p-2.5 rounded-xl hover:bg-gray-100 transition">
          <Download className="w-5 h-5 text-gray-600" />
        </button>

        <button className="p-2.5 rounded-xl hover:bg-gray-100 transition">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

    </header>
  );
}
