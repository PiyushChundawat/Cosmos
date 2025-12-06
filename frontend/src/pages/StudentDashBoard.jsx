import React from "react";

// Dashboard Components
import HeaderBar from "../components/Dashboard/Header.jsx";
import ProfileCard from "../components/Dashboard/ProfileCard.jsx";
import ScoreCard from "../components/Dashboard/ScoreCard.jsx";
import RoadMapProgress from "../components/Dashboard/RoadMapProgress.jsx";
import TestStats from "../components/Dashboard/TestStats.jsx";
import WeakAreas from "../components/Dashboard/WeakAreas.jsx";
import ActivityHeatmaps from "../components/Dashboard/ActivityHeatmaps.jsx";
import ActionButtons from "../components/Dashboard/ActionButtons.jsx";

export default function StudentDashBoard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

        <HeaderBar studentName="Jennie" />

        <div className="space-y-6">
          <ProfileCard
            college="MNNIT"
            course="Computer Science and Engineering"
            year="3rd Year"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScoreCard title="Resume Score" score={85} maxScore={100} delay="0.1s" />
            <ScoreCard title="Placement Readiness Score" score={72} maxScore={100} delay="0.2s" />
          </div>

          <RoadMapProgress />
          <TestStats />
          <WeakAreas />
          <ActivityHeatmaps />
          <ActionButtons />
        </div>

      </div>
    </div>
  );
}
