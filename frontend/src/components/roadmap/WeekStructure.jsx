import { ChevronDown, ChevronUp, Plus, GripVertical, CheckCircle2, Circle, MoreHorizontal } from "lucide-react";
import { FocusAreas, TasksList, ResourcesList } from "./WeekSections";

// ==========================================================
// 1) WEEK HEADER COMPONENT
// ==========================================================
export function WeekHeader({ week, progress, expanded, toggleWeek, updateWeekStatus }) {
  const Icon = week.icon;

  return (
    <div
      className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/70 transition"
      onClick={() => toggleWeek(week.id)}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${week.color} flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        <div>
          <h3 className="font-bold text-gray-800 text-lg">{week.title}</h3>

          <div className="flex items-center gap-2 mt-1">
            <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${week.color}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="text-xs text-gray-500">
              {week.tasks.filter((t) => t.done).length}/{week.tasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div
        className="flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <select
          value={week.status}
          onChange={(e) => updateWeekStatus(week.id, e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button className="p-2 rounded-lg hover:bg-gray-100">
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

// ==========================================================
// 2) WEEK BODY COMPONENT
// ==========================================================
export function WeekBody({ week, toggleTask }) {
  return (
    <div className="px-5 pb-6 space-y-6 border-t border-gray-200">

      {/* Focus Areas */}
      <FocusAreas week={week} />

      {/* Topics */}
      <div>
        <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Topics Overview
        </h4>
        <p className="bg-gray-50 text-gray-700 p-4 rounded-2xl leading-relaxed">
          {week.topics}
        </p>
      </div>

      {/* Tasks */}
      <TasksList week={week} toggleTask={toggleTask} />

      {/* Resources */}
      <ResourcesList week={week} />
    </div>
  );
}

// ==========================================================
// 3) WEEK CARD WRAPPER COMPONENT
// ==========================================================
export function WeekCard({ week, index, expanded, toggleWeek, toggleTask, updateWeekStatus }) {
  const completed = week.tasks.filter((t) => t.done).length;
  const total = week.tasks.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 overflow-hidden transition"
      style={{ animation: `fadeInUp .4s ease ${index * 0.12}s both` }}
    >
      <WeekHeader
        week={week}
        progress={progress}
        expanded={expanded}
        toggleWeek={toggleWeek}
        updateWeekStatus={updateWeekStatus}
      />

      {expanded && (
        <WeekBody
          week={week}
          toggleTask={toggleTask}
        />
      )}
    </div>
  );
}
