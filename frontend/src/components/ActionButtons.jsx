import { X, Sparkles, Loader2 } from "lucide-react";

export default function ActionButtons({ isComplete, onCancel, onView }) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onCancel}
        disabled={isComplete}
        className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <X className="w-5 h-5" />
        Cancel
      </button>

      <button
        onClick={onView}
        disabled={!isComplete}
        className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
          isComplete
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isComplete ? (
          <>
            <Sparkles className="w-5 h-5" />
            View Roadmap
          </>
        ) : (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        )}
      </button>
    </div>
  );
}
