import { Search } from "lucide-react";

// ==========================================================
// 1) PROGRESS CARD
// ==========================================================
export function ProgressCard({ total, completed }) {
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="bg-white/80 p-6 rounded-3xl shadow-xl border border-white/50">
      <h3 className="font-bold text-gray-800 mb-2">Progress</h3>

      <div className="text-center">
        <p className="text-4xl font-bold text-blue-600">{percent}%</p>
        <p className="text-gray-500 mt-1">
          {completed} of {total} tasks completed
        </p>
      </div>
    </div>
  );
}

// ==========================================================
// 2) FILTERS CARD
// ==========================================================
export function FiltersCard({ active, setActive }) {
  const filters = ["All", "Pending", "In Progress", "Done"];

  return (
    <div className="bg-white/80 p-6 rounded-3xl shadow-xl border border-white/50">
      <h3 className="font-bold text-gray-800 mb-3">Filters</h3>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              active === filter
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

// ==========================================================
// 3) SEARCH CARD
// ==========================================================
export function SearchCard({ value, setValue }) {
  return (
    <div className="bg-white/80 p-6 rounded-3xl shadow-xl border border-white/50">
      <h3 className="font-bold text-gray-800 mb-3">Search</h3>

      <div className="relative">
        <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search weeks..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition"
        />
      </div>
    </div>
  );
}
