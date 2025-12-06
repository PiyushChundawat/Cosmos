import WeekHeader from "./WeekHeader";
import WeekBody from "./WeekBody";

export default function WeekCard({
  week,
  index,
  expanded,
  toggleWeek,
  toggleTask,
  updateWeekStatus,
}) {
  const completed = week.tasks.filter((t) => t.done).length;
  const total = week.tasks.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div
      className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border border-white/40 transition-all"
      style={{
        animation: `fadeInUp .4s ease ${index * 0.12}s both`,
      }}
    >
      {/* HEADER */}
      <WeekHeader
        week={week}
        progress={progress}
        expanded={expanded}
        toggleWeek={toggleWeek}
        updateWeekStatus={updateWeekStatus}
      />

      {/* BODY (COLLAPSIBLE) */}
      {expanded && (
        <WeekBody
          week={week}
          toggleTask={toggleTask}
        />
      )}
    </div>
  );
}
