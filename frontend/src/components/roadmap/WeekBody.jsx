import FocusAreas from "./FocusAreas";
import TasksList from "./TasksList";
import ResourcesList from "./ResourcesList";

export default function WeekBody({ week, toggleTask }) {
  return (
    <div className="px-5 pb-6 space-y-6 border-t border-gray-200 animate-fadeIn">

      {/* Focus Areas */}
      <FocusAreas week={week} />

      {/* Week Topics */}
      <div>
        <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Topics Overview
        </h4>

        <p className="bg-gray-50 text-gray-700 p-4 rounded-2xl leading-relaxed">
          {week.topics}
        </p>
      </div>

      {/* Tasks Section */}
      <TasksList
        week={week}
        toggleTask={toggleTask}
      />

      {/* Resources Section */}
      <ResourcesList week={week} />
    </div>
  );
}
