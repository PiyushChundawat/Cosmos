import { CheckCircle2, Loader2 } from "lucide-react";

export default function StatusList({ statusMessages, completedStatuses, currentStatus, isComplete }) {
  return (
    <div className="space-y-3 mb-8">
      {statusMessages.map((status, index) => {
        const isCompleted = completedStatuses.includes(index);
        const isCurrent = index === currentStatus && !isComplete;

        return (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
              isCompleted
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                : isCurrent
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-lg shadow-blue-500/10"
                : "bg-gray-50/50 border border-transparent"
            }`}
            style={{
              animation: isCurrent ? "pulse 2s ease-in-out infinite" : "none",
              opacity: isCompleted || isCurrent ? 1 : 0.4,
              transform: isCurrent ? "scale(1.02)" : "scale(1)",
            }}
          >
            <div className="flex-shrink-0">
              {isCompleted ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              ) : isCurrent ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                  {status.icon}
                </div>
              )}
            </div>

            <span
              className={`font-medium ${
                isCompleted ? "text-green-700" : isCurrent ? "text-blue-700" : "text-gray-400"
              }`}
            >
              {status.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
