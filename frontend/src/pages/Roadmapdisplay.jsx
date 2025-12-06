// pages/roadmap.jsx
"use client";

import RoadmapDisplay from "@/components/roadmap/RoadmapDisplay";

// Import ALL components so Next.js pre-bundles them (optional but you asked)
import "@/components/roadmap/HeaderBar";
import "@/components/roadmap/WeekCard";
import "@/components/roadmap/WeekHeader";
import "@/components/roadmap/WeekBody";
import "@/components/roadmap/FocusAreas";
import "@/components/roadmap/TasksList";
import "@/components/roadmap/ResourcesList";
import "@/components/roadmap/SidebarPanels";

import "@/components/roadmap/sidebar/ProgressCard";
import "@/components/roadmap/sidebar/FiltersCard";
import "@/components/roadmap/sidebar/SearchCard";
import "@/components/roadmap/sidebar/QuickActionsCard";
import "@/components/roadmap/sidebar/StatsCard";

export default function RoadmapPage() {
  return (
    <main className="min-h-screen">
      <RoadmapDisplay />
    </main>
  );
}
