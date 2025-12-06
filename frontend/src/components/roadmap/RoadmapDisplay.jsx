"use client";

import { useState } from "react";

import HeaderBar from "./Header";
import WeekCard from "./WeekCard";
import SidebarPanels from "./SidebarPanels";

import {
  Code,
  Sparkles,
  Palette,
  Database
} from "lucide-react";

// =========================
// INLINE WEEK DATA
// =========================

const initialWeeks = [
  {
    id: 1,
    title: "Week 1: Fundamentals",
    status: "in-progress",
    focusAreas: ["HTML", "CSS", "JavaScript Basics"],
    topics:
      "Learn the core building blocks of web development: semantic HTML, layouts, and JavaScript fundamentals.",
    tasks: [
      { id: 1, text: "Complete HTML tutorial", done: true },
      { id: 2, text: "Build responsive navbar", done: true },
      { id: 3, text: "Master CSS Flexbox & Grid", done: false },
      { id: 4, text: "Learn JS basics", done: false }
    ],
    resources: [],
    color: "from-blue-500 to-cyan-500",
    icon: Code
  },
  {
    id: 2,
    title: "Week 2: React Fundamentals",
    status: "pending",
    focusAreas: ["React", "Hooks", "Components"],
    topics: "Learn modern React fundamentals like components, props & hooks.",
    tasks: [
      { id: 1, text: "Setup React project", done: false },
      { id: 2, text: "Build first component", done: false }
    ],
    resources: [],
    color: "from-indigo-500 to-purple-500",
    icon: Sparkles
  },
  {
    id: 3,
    title: "Week 3: UI/UX Design",
    status: "pending",
    focusAreas: ["Tailwind CSS", "Animations", "Design Systems"],
    topics: "Learn UI/UX fundamentals and make beautiful layouts.",
    tasks: [{ id: 1, text: "Study UI basics", done: false }],
    resources: [],
    color: "from-pink-500 to-rose-500",
    icon: Palette
  },
  {
    id: 4,
    title: "Week 4: Backend & APIs",
    status: "pending",
    focusAreas: ["Node.js", "REST APIs", "Database"],
    topics: "Learn backend integration and full-stack fundamentals.",
    tasks: [{ id: 1, text: "Learn REST API basics", done: false }],
    resources: [],
    color: "from-emerald-500 to-teal-500",
    icon: Database
  }
];

// =========================
// MAIN COMPONENT
// =========================

export default function RoadmapDisplay() {
  const [weeks, setWeeks] = useState(initialWeeks);
  const [expandedWeeks, setExpandedWeeks] = useState([1]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle expand/collapse week
  const toggleWeek = (id) => {
    setExpandedWeeks((prev) =>
      prev.includes(id)
        ? prev.filter((wk) => wk !== id)
        : [...prev, id]
    );
  };

  // Toggle task done/undone
  const toggleTask = (weekId, taskId) => {
    setWeeks((prev) =>
      prev.map((week) =>
        week.id === weekId
          ? {
              ...week,
              tasks: week.tasks.map((task) =>
                task.id === taskId ? { ...task, done: !task.done } : task
              )
            }
          : week
      )
    );
  };

  // Update week status
  const updateWeekStatus = (weekId, status) => {
    setWeeks((prev) =>
      prev.map((week) =>
        week.id === weekId ? { ...week, status } : week
      )
    );
  };

  // Progress calc
  const totalTasks = weeks.reduce((sum, w) => sum + w.tasks.length, 0);
  const completedTasks = weeks.reduce(
    (sum, w) => sum + w.tasks.filter((t) => t.done).length,
    0
  );

  // Filters + Search
  const filteredWeeks = weeks.filter((week) => {
    const matchFilter =
      activeFilter === "All" ||
      activeFilter === "Pending" && week.status === "pending" ||
      activeFilter === "In Progress" && week.status === "in-progress" ||
      activeFilter === "Done" && week.status === "done";

    const matchSearch =
      !searchQuery ||
      week.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      week.focusAreas.some(f =>
        f.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* TOP BAR */}
      <HeaderBar />

      <div className="max-w-7xl mx-auto p-6 flex gap-6">

        {/* LEFT: Weeks List */}
        <div className="flex-1 space-y-5">
          {filteredWeeks.map((week, index) => (
            <WeekCard
              key={week.id}
              week={week}
              index={index}
              expanded={expandedWeeks.includes(week.id)}
              toggleWeek={toggleWeek}
              toggleTask={toggleTask}
              updateWeekStatus={updateWeekStatus}
            />
          ))}
        </div>

        {/* RIGHT SIDEBAR */}
        <SidebarPanels
          weeks={weeks}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
        />
      </div>
    </div>
  );
}
