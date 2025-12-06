import { Plus } from "lucide-react";

export default function FocusAreas({ week }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
        Focus Areas
      </h4>

      <div className="flex flex-wrap gap-2">
        {week.focusAreas.map((area, index) => (
          <span
            key={index}
            className={`px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${week.color} shadow-md`}
          >
            {area}
          </span>
        ))}

        {/* Add Button */}
        <button className="px-4 py-2 rounded-full border border-dashed border-gray-400 text-gray-600 flex items-center gap-2 hover:border-blue-500 hover:text-blue-500 transition">
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
}
