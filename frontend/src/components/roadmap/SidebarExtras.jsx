import { Plus, Share2, Download, Target, Clock, CheckCircle2 } from "lucide-react";

// ==========================================================
// 1) QUICK ACTIONS CARD
// ==========================================================
export function QuickActionsCard() {
  const actions = [
    { icon: Plus, label: "Add New Week", color: "text-blue-500" },
    { icon: Download, label: "Export Roadmap", color: "text-indigo-500" },
    { icon: Share2, label: "Share Roadmap", color: "text-purple-500" },
  ];

  return (
    <div className="bg-white/80 p-6 rounded-3xl shadow-xl border border-white/50">
      <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>

      <div className="space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition rounded-xl"
          >
            <action.icon className={`w-5 h-5 ${action.color}`} />
            <span className="text-gray-700 font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ==========================================================
// 2) STATS CARD
// ==========================================================
export function StatsCard({ weeks }) {
  const stats = [
    {
      icon: Target,
      label: "Total Weeks",
      value: weeks.length,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      icon: Clock,
      label: "In Progress",
      value: weeks.filter((w) => w.status === "in-progress").length,
      color: "text-amber-500",
      bg: "bg-amber-100",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: weeks.filter((w) => w.status === "done").length,
      color: "text-green-500",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="bg-white/80 p-6 rounded-3xl shadow-xl border border-white/50">
      <h3 className="font-bold text-gray-800 mb-4">Statistics</h3>

      <div className="space-y-4">
        {stats.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <span className="text-gray-600 font-medium">{item.label}</span>
            </div>

            <span className="text-2xl font-bold text-gray-800">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
