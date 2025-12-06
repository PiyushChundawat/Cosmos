import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage"; 
import LoginPage from "./pages/LoginPage"; 
import SignupPage from "./pages/SignupPage.jsx";
import OnboardingFlow from "./pages/OnboardingFlow.jsx";  // ⭐ FIXED
import StudentDashBoard from "./pages/StudentDashBoard.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/dashboard" element={<StudentDashBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
