import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/DashBoard.jsx';

// TPO
import TPOLogin from './pages/tpo/TPOLogin.jsx';
import TPOSignup from './pages/tpo/TPOSignup.jsx';
import TPODashboard from './pages/tpo/TPODashboard.jsx';

// These are NOT inside the tpo folder
import StudentAnalytics from './pages/StudentAnalytics.jsx';
import FacultyAnalytics from './pages/FacultyAnalytics.jsx';

// Student
import StudentSignup from './pages/student/StudentSignup.jsx';
import StudentLogin from './pages/student/StudentLogin.jsx';
import StudentLayout from './components/student/StudentLayout.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import UpcomingTests from './pages/student/UpcomingTests.jsx';
import TestDetails from './pages/student/TestDetails.jsx';
import TakeTest from './pages/student/TakeTest.jsx';
import Performance from './pages/student/Performance.jsx';
import ResumeUpload from './pages/student/ResumeUpload.jsx';
import ResumeAnalysis from './pages/student/ResumeAnalysis.jsx';
import StudentProfile from './pages/student/StudentProfile.jsx';

// Faculty
import FacultySignup from './pages/faculty/FacultySignup.jsx';
import FacultyLogin from './pages/faculty/FacultyLogin.jsx';
import FacultyLayout from './layouts/FacultyLayout.jsx';
import FacultyDashboard from './pages/faculty/FacultyDashboard.jsx';
import ManageQuestions from './pages/faculty/ManageQuestions.jsx';
import ManageTests from './pages/faculty/ManageTests.jsx';
import TestAnalytics from './pages/faculty/TestAnalytics.jsx';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* TPO */}
        <Route path="/tpo/login" element={<TPOLogin />} />
        <Route path="/tpo/signup" element={<TPOSignup />} />
        <Route path="/tpo/dashboard" element={<TPODashboard />} />
        <Route path="/tpo/student-analytics" element={<StudentAnalytics />} />
        <Route path="/tpo/faculty-analytics" element={<FacultyAnalytics />} />

        {/* Student */}
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/login" element={<StudentLogin />} />

        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="tests" element={<UpcomingTests />} />
          <Route path="test-details/:testId" element={<TestDetails />} />
          <Route path="take-test/:testId" element={<TakeTest />} />
          <Route path="performance" element={<Performance />} />
          <Route path="resume" element={<ResumeUpload />} />
          <Route path="resume-analysis" element={<ResumeAnalysis />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Faculty */}
        <Route path="/faculty/signup" element={<FacultySignup />} />
        <Route path="/faculty/login" element={<FacultyLogin />} />
        
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="questions" element={<ManageQuestions />} />
          <Route path="tests" element={<ManageTests />} />
          <Route path="tests/:id/analytics" element={<TestAnalytics />} />
          <Route path="analytics" element={<Navigate to="/faculty/tests" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
