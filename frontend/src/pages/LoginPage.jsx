import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// --- ICON COMPONENTS ---
const UserIcon = (props) => (
  <svg {...props} width="24" height="24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const MailIcon = (props) => (
  <svg {...props} width="24" height="24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const LockIcon = (props) => (
  <svg {...props} width="24" height="24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const BriefcaseIcon = (props) => (
  <svg {...props} width="24" height="24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const UsersIcon = (props) => (
  <svg {...props} width="24" height="24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-6 h-6 mx-auto mb-2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// ROLE LOGIC
const roles = ["Student", "Faculty", "TPO"];
const getRoleIcon = (role) => {
  switch (role) {
    case "Student": return UserIcon;
    case "Faculty": return BriefcaseIcon;
    case "TPO": return UsersIcon;
    default: return UserIcon;
  }
};

// --- LOGIN PAGE ---
const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tpoId, setTpoId] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // ⭐ FOR REDIRECT

  // Handle role change
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role !== "TPO") setTpoId("");
    setStatusMessage("");
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage("");

    setTimeout(() => {
      const isTpo = selectedRole === "TPO";

      if (!email || !password || (isTpo && !tpoId)) {
        setStatusMessage("Please fill in all required fields.");
      } else {
        navigate("/onboarding"); // ⭐ AUTO REDIRECT HERE
      }

      setIsLoading(false);
    }, 1000);
  };

  // Input Field Component
  const InputField = ({ label, type, value, onChange, icon: Icon, placeholder }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Icon />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 
          placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center p-4">

      <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-3xl shadow-2xl">

        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">LOGIN PORTAL</h1>

        <p className="text-md font-semibold text-gray-700 mb-4">Select Role</p>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {roles.map((role) => {
            const Icon = getRoleIcon(role);
            const isActive = selectedRole === role;

            return (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl font-semibold border-2 
                ${isActive
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow"
                  : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                {role}
              </button>
            );
          })}
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`p-3 mb-6 rounded-xl text-center font-medium 
          ${statusMessage.includes("successful")
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {statusMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={MailIcon}
            placeholder="Enter your email"
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={LockIcon}
            placeholder="Enter your password"
          />

          {selectedRole === "TPO" && (
            <InputField
              label="TPO ID"
              type="text"
              value={tpoId}
              onChange={(e) => setTpoId(e.target.value)}
              icon={BriefcaseIcon}
              placeholder="Enter TPO ID"
            />
          )}

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between mb-8">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2">Remember me</span>
            </label>

            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold text-white text-lg bg-blue-600 
            hover:bg-blue-700 shadow-lg transition active:scale-95 disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "LOGIN"}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-8 text-center text-sm text-gray-600">
          New user?
          <Link 
            to="/signup" 
            className="ml-1 font-semibold text-blue-600 hover:text-blue-500"
          >
            ( Sign Up )
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
