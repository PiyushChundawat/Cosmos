import { ChevronDown, ChevronUp } from "lucide-react";

export default function WeekHeader({
  week,
  progress,
  expanded,
  toggleWeek,
  updateWeekStatus,
}) {
  const Icon = week.icon;

  return (
    <div
      className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/70 transition"
      onClick={() => toggleWeek(week.id)}
    >
      {/* LEFT SECTION: Icon + Title + Progress */}
      <div className="flex items-center gap-4">
        
        {/* Week Icon */}
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${week.color} flex items-center justify-center shadow-md`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Title + Progress */}
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{week.title}</h3>

          <div className="flex items-center gap-2 mt-1">
            {/* Progress Bar */}
            <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className={`h-full bg-gradient-to-r ${week.color} rounded-full`}
              />
            </div>

            <span className="text-xs text-gray-500">
              {week.tasks.filter((t) => t.done).length}/{week.tasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Status Dropdown + Arrow */}
      <div
        className="flex items-center gap-3"
        onClick={(e) => e.stopPropagation()} // <-- Prevent collapsing when clicking dropdown
      >
        {/* Status Selector */}
        <select
          value={week.status}
          onChange={(e) => updateWeekStatus(week.id, e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium outline-none cursor-pointer"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {/* Expand / Collapse Arrow */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
}
