import { useState, useEffect } from "react";
import { Compass, Rocket } from "lucide-react";

import AnimatedBackground from "./components/AnimatedBackground";
import TopBar from "./components/TopBar";
import ProgressBar from "./components/ProgressBar";
import StatusList from "./components/StatusList";
import ActionButtons from "./components/ActionButtons";
import SuccessFooter from "./components/SuccessFooter";

const statusMessages = [
  { text: "Analyzing your goals...", icon: "🎯" },
  { text: "Creating weekly structure...", icon: "📅" },
  { text: "Adding learning tasks...", icon: "✏️" },
  { text: "Gathering resources...", icon: "📚" },
  { text: "Finalizing your roadmap...", icon: "🚀" },
];

export default function RoadmapGeneration() {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [completedStatuses, setCompletedStatuses] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);

  useEffect(() => {
    if (isCanceled) return;

    const interval = setInterval(() => {
      setCompletedStatuses((prev) => {
        if (prev.length < statusMessages.length) return [...prev, prev.length];
        return prev;
      });

      setCurrentStatus((prev) => {
        if (prev < statusMessages.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        setTimeout(() => setIsComplete(true), 500);
        return prev;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isCanceled]);

  const handleCancel = () => setIsCanceled(true);

  const handleViewRoadmap = () => (window.location.href = "/roadmap");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      
      <AnimatedBackground />
      <TopBar />

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50"
          style={{ animation: "scaleIn 0.5s ease-out" }}
        >

          {/* Icon */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 animate-ping opacity-20" />
              <div className="absolute inset-2 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 animate-ping opacity-30 delay-300" />

              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30"
                style={{ animation: "float 3s ease-in-out infinite" }}
              >
                {isComplete ? (
                  <Rocket className="w-12 h-12 text-white" style={{ animation: "bounceIn 0.5s ease-out" }} />
                ) : (
                  <Compass className="w-12 h-12 text-white animate-spin" style={{ animationDuration: "3s" }} />
                )}
              </div>
            </div>

            <h2 className="mt-8 text-2xl font-bold text-gray-800">
              {isComplete ? "🎉 Roadmap Ready!" : "Generating your roadmap..."}
            </h2>
            <p className="mt-2 text-gray-500">
              {isComplete
                ? "Your personalized learning path is ready to explore"
                : "Our AI is crafting your personalized learning journey"}
            </p>
          </div>

          {/* Progress */}
          <ProgressBar completed={completedStatuses.length} total={statusMessages.length} />

          {/* Status List */}
          <StatusList
            statusMessages={statusMessages}
            completedStatuses={completedStatuses}
            currentStatus={currentStatus}
            isComplete={isComplete}
          />

          {/* Buttons */}
          <ActionButtons isComplete={isComplete} onCancel={handleCancel} onView={handleViewRoadmap} />
        </div>
      </main>

      {isComplete && <SuccessFooter />}

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(100%); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
