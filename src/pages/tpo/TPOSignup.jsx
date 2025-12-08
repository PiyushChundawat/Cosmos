import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function TPOSignup() {
  const [form, setForm] = useState({
    collegeName: '',
    collegeEmail: '',
    address: '',
    tpoName: '',
    tpoEmail: '',
    phone: '',
    password: '',
    amount: 1000,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validateForm = () => {
    const errs = {};
    
    // College Details Validation
    if (!form.collegeName.trim()) errs.collegeName = 'College name required';
    if (!form.collegeEmail.trim() || !/\.ac\.in|\.edu/.test(form.collegeEmail))
      errs.collegeEmail = 'Valid college email domain required (e.g., college.ac.in)';
    if (!form.address.trim()) errs.address = 'Address required';
    
    // TPO Details Validation
    if (!form.tpoName.trim()) errs.tpoName = 'Full name required';
    if (!form.tpoEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.tpoEmail))
      errs.tpoEmail = 'Valid email required';
    if (!form.phone.trim() || form.phone.length < 10)
      errs.phone = 'Valid 10-digit phone number required';
    if (!form.password || form.password.length < 8)
      errs.password = 'Password must be at least 8 characters';
    
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      // Generate mock codes for demonstration
      const studentCode = 'STU' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const facultyCode = 'FAC' + Math.random().toString(36).substr(2, 9).toUpperCase();

      setCodes({
        studentCode: studentCode,
        facultyCode: facultyCode,
      });

      // Store user info in localStorage for dashboard
      localStorage.setItem('tpo_token', 'mock-token-' + Date.now());
      localStorage.setItem('tpo_college', form.collegeName);
      localStorage.setItem('tpo_user', form.tpoName);
      localStorage.setItem('tpo_email', form.tpoEmail);

    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (codes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="text-center border-2 border-emerald-300">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-emerald-700 mb-2">Signup Successful!</h2>
            <p className="text-gray-600 mb-8">Your college has been registered</p>

            <div className="space-y-4 mb-8">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-5 rounded-xl border-2 border-emerald-300">
                <p className="text-gray-700 text-sm font-semibold mb-2">📚 Student Code</p>
                <p className="text-3xl font-bold text-emerald-700 font-mono tracking-wider">{codes.studentCode}</p>
                <p className="text-gray-500 text-xs mt-2">Share with students for registration</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-300">
                <p className="text-gray-700 text-sm font-semibold mb-2">👨‍🏫 Faculty Code</p>
                <p className="text-3xl font-bold text-blue-700 font-mono tracking-wider">{codes.facultyCode}</p>
                <p className="text-gray-500 text-xs mt-2">Share with faculty members for registration</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-8">
              <p className="text-yellow-800 text-sm">
                💡 <strong>Important:</strong> Save these codes. You'll need them to manage students and faculty.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                size="lg" 
                onClick={() => navigate('/tpo/dashboard', { replace: true })}
                className="w-full"
              >
                Go to Dashboard →
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => navigate('/tpo/login', { replace: true })}
                className="w-full"
              >
                Login with Your Email
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Signup Form Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="text-emerald-600">TPO</span> College Signup
          </h1>
          <p className="text-gray-600">Register your college and start managing placements</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-emerald-100">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8">
            <h2 className="text-2xl font-bold text-white">College & TPO Registration</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* College Details Section */}
            <div className="border-b-2 border-gray-200 pb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🏫</span>
                <h3 className="text-xl font-bold text-gray-900">College Details</h3>
              </div>

              <div className="space-y-4">
                <Input
                  label="College Name"
                  name="collegeName"
                  value={form.collegeName}
                  onChange={handleChange}
                  placeholder="e.g., MNNIT Allahabad"
                  error={errors.collegeName}
                  required
                />

                <Input
                  label="College Email Domain"
                  name="collegeEmail"
                  value={form.collegeEmail}
                  onChange={handleChange}
                  placeholder="e.g., mnnit.ac.in"
                  error={errors.collegeEmail}
                  required
                />

                <Input
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g., Allahabad, UP, India"
                  error={errors.address}
                  required
                />
              </div>
            </div>

            {/* TPO Details Section */}
            <div className="border-b-2 border-gray-200 pb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">👤</span>
                <h3 className="text-xl font-bold text-gray-900">TPO Details</h3>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="tpoName"
                  value={form.tpoName}
                  onChange={handleChange}
                  placeholder="e.g., Dr. John Doe"
                  error={errors.tpoName}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="tpoEmail"
                  value={form.tpoEmail}
                  onChange={handleChange}
                  placeholder="e.g., tpo@college.edu"
                  error={errors.tpoEmail}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g., 9876543210"
                  error={errors.phone}
                  required
                />
              </div>
            </div>

            {/* Subscription Section */}
            <div className="border-b-2 border-gray-200 pb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">💳</span>
                <h3 className="text-xl font-bold text-gray-900">Subscription & Security</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-emerald-50 p-5 rounded-lg border-2 border-emerald-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subscription Amount
                  </label>
                  <div className="text-3xl font-bold text-emerald-700">
                    ₹{form.amount}
                  </div>
                  <p className="text-gray-600 text-xs mt-2">One-time payment for annual subscription</p>
                </div>

                <Input
                  label="Create Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter a strong password"
                  error={errors.password}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
                <p className="text-red-700 font-semibold">❌ {errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              size="lg" 
              loading={loading} 
              className="w-full"
              type="submit"
            >
              {loading ? 'Creating Account...' : 'Submit & Register'}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link
                  to="/tpo/login"
                  className="text-emerald-600 font-bold hover:text-emerald-700 underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="text-4xl mb-3">📋</div>
            <h4 className="font-bold text-gray-900 mb-2">Fill Details</h4>
            <p className="text-gray-600 text-sm">Provide your college and TPO information</p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl mb-3">✔️</div>
            <h4 className="font-bold text-gray-900 mb-2">Verify</h4>
            <p className="text-gray-600 text-sm">Submit your registration form</p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h4 className="font-bold text-gray-900 mb-2">Get Codes</h4>
            <p className="text-gray-600 text-sm">Receive student & faculty codes</p>
          </Card>
        </div>
      </div>
    </div>
  );
}