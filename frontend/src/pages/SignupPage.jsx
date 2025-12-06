import React, { useState } from 'react';

// ====================================================================
// 1. ICON AND HELPER COMPONENTS
// ====================================================================

// --- Icon Components (Lucide Icons replacement using SVG) ---
const UserIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const MailIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>);
const LockIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
const BriefcaseIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>);
const UsersIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mx-auto mb-2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const GraduationCapIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 0 6 0 6 0s3 0 6 0v-5"/></svg>);
const HashIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>);
const PhoneIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-7.58-7.58A19.79 19.79 0 0 1 2 4.18 2 2 0 0 1 4.18 2h3a2 2 0 0 1 2 1.72 17.65 17.65 0 0 0 .15 1.34A6.1 6.1 0 0 1 8.5 7.15c-1.33.64-2.45 1.63-3.07 3.07a6.1 6.1 0 0 0-1.74 3.79c.07.7.35 1.34.8 1.83a6.1 6.1 0 0 0 1.83.8A19.79 19.79 0 0 0 20 20.82a2 2 0 0 1 1.72 2z"/></svg>);


const roles = ['Student', 'Faculty', 'TPO'];

const getRoleIcon = (role) => {
    switch (role) {
        case 'Student': return UserIcon;
        case 'Faculty': return BriefcaseIcon; 
        case 'TPO': return UsersIcon;
        default: return UserIcon;
    }
};

// Input Field Component
const InputField = ({ label, type, value, onChange, icon: Icon, placeholder, required = true, name, className = '' }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Icon />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          name={name} 
          className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 shadow-sm ${className}`}
        />
      </div>
    </div>
);

// ====================================================================
// 2. MAIN APP COMPONENT (The standalone Sign Up Page)
// ====================================================================

const SignupPage = () => {
    const [selectedRole, setSelectedRole] = useState('Student');
    const [form, setForm] = useState({
        name: '',
        college: '',
        rollNo: '',
        mobile: '', // Added mobile field
        year: '1st',
        email: '',
        password: '',
        collegeCode: ''
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        // Reset role-specific fields when role changes
        setForm(prev => ({
            ...prev,
            collegeCode: '',
            rollNo: '',
            year: '1st'
        }));
        setStatusMessage('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage('');

        // Basic form validation based on role
        let requiredFields = ['email', 'password', 'college', 'mobile'];
        if (selectedRole === 'Student') {
            requiredFields = ['name', 'college', 'rollNo', 'year', 'email', 'password', 'mobile'];
        } else if (selectedRole === 'Faculty' || selectedRole === 'TPO') {
            requiredFields = ['name', 'college', 'collegeCode', 'email', 'password', 'mobile'];
        }

        const isValid = requiredFields.every(field => form[field]);

        setTimeout(() => {
            if (!isValid) {
                setStatusMessage('Please fill in all required fields for your selected role.');
            } else {
                // Mock success
                console.log(`Registering as ${selectedRole}:`, form);
                setStatusMessage(`Registration successful! You can now proceed to login.`);
            }
            setIsLoading(false);
        }, 1500);
    };

    const isStudent = selectedRole === 'Student';
    const isTPOOrFaculty = selectedRole === 'Faculty' || selectedRole === 'TPO';

    return (
        // Main container for centering and background
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-[Inter] overflow-auto py-10">
            
            {/* Sign Up Form Card - Enhanced depth and attraction */}
            <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-indigo-200 relative transform transition-all duration-500 hover:shadow-indigo-300">
                
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-2 tracking-tight">
                    Create Account
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Join the portal by selecting your role below.
                </p>
                
                <p className="text-md font-semibold text-gray-700 mb-4">
                    Select Role
                </p>

                {/* Role Selection Tabs - Enhanced button styles */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {roles.map((role) => {
                        const RoleIcon = getRoleIcon(role);
                        const isSelected = selectedRole === role;
                        
                        return (
                            <button
                                key={role}
                                onClick={() => handleRoleChange(role)}
                                className={`col-span-1 flex flex-col items-center justify-center p-3 text-sm font-bold rounded-xl border-2 transition duration-300 shadow-md transform hover:scale-[1.02]
                                ${isSelected
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-300 shadow-indigo-100'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-gray-50'
                                }
                                `}
                            >
                                <RoleIcon className="w-6 h-6 mb-1" />
                                {role}
                            </button>
                        );
                    })}
                </div>

                {/* Status Message */}
                {statusMessage && (
                <div className={`p-3 mb-6 rounded-xl text-center font-medium border-l-4 ${statusMessage.startsWith('Registration successful!') 
                    ? 'bg-green-100 text-green-700 border-green-500' 
                    : 'bg-red-100 text-red-700 border-red-500'}`}
                >
                    {statusMessage}
                </div>
                )}
                
                {/* Registration Form */}
                <form onSubmit={handleSignUp}>
                    
                    {/* Common Name Field (for all except Student name) */}
                    {!isStudent && (
                        <InputField label="Full Name" type="text" name="name" value={form.name} onChange={handleChange} icon={UserIcon} placeholder="Enter your full name" />
                    )}

                    {/* Student Specific Fields */}
                    {isStudent && (
                        <>
                            <InputField label="Full Name" type="text" name="name" value={form.name} onChange={handleChange} icon={UserIcon} placeholder="Enter your full name" />
                            <InputField label="College Name" type="text" name="college" value={form.college} onChange={handleChange} icon={GraduationCapIcon} placeholder="Name of your College" />
                            <InputField label="Roll Number" type="text" name="rollNo" value={form.rollNo} onChange={handleChange} icon={HashIcon} placeholder="University Roll Number" />

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                                <div className="relative">
                                    <select
                                        name="year"
                                        value={form.year}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 shadow-sm appearance-none"
                                    >
                                        <option value="1st">1st Year</option>
                                        <option value="2nd">2nd Year</option>
                                        <option value="3rd">3rd Year</option>
                                        <option value="4th">4th Year</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* TPO / Faculty Specific Fields */}
                    {isTPOOrFaculty && (
                        <>
                            <InputField label="College Name" type="text" name="college" value={form.college} onChange={handleChange} icon={GraduationCapIcon} placeholder="College / University Name" />
                            <InputField label="College Code" type="text" name="collegeCode" value={form.collegeCode} onChange={handleChange} icon={HashIcon} placeholder="Unique College Code" />
                        </>
                    )}
                    
                    {/* Common Fields */}
                    <InputField label="Mobile Number" type="tel" name="mobile" value={form.mobile} onChange={handleChange} icon={PhoneIcon} placeholder="Enter your mobile number" />
                    <InputField label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} icon={MailIcon} placeholder="Enter your email address" />
                    <InputField label="Password" type="password" name="password" value={form.password} onChange={handleChange} icon={LockIcon} placeholder="Create a strong password" />

                    {/* Sign Up Button - Strong primary button style */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-3 px-4 mt-8 border border-transparent text-lg font-bold rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'SIGN UP'
                        )}
                    </button>
                </form>

                {/* Switch to Login Link: Ready for your router */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?
                        {/* Replace '#' with the actual path to your Login route */}
                        <a href="#" className="ml-1 font-semibold text-indigo-600 hover:text-indigo-500 transition duration-150">
                            ( Log In )
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;