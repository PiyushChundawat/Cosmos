// pages/tpo/TPOSignup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import HomeButton from '../../components/HomeButton';
import api from '../../api/axios';

export default function TPOSignup() {
  const [form, setForm] = useState({
    collegeName: '',
    collegeEmail: '',
    address: '',
    tpoName: '',
    tpoEmail: '',
    phone: '',
    password: '',
    amount: 20000,
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
    
    if (!form.collegeName.trim()) errs.collegeName = 'College name required';
    if (!form.collegeEmail.trim() || !/\.ac\.in|\.edu/.test(form.collegeEmail))
      errs.collegeEmail = 'Valid college email domain required (e.g., college.ac.in)';
    if (!form.address.trim()) errs.address = 'Address required';
    if (!form.tpoName.trim()) errs.tpoName = 'Full name required';
    if (!form.tpoEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.tpoEmail))
      errs.tpoEmail = 'Valid email required';
    if (!form.phone.trim() || form.phone.length < 10)
      errs.phone = 'Valid 10-digit phone number required';
    if (!form.password || form.password.length < 8)
      errs.password = 'Password must be at least 8 characters';
    
    return errs;
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);

    try {
      // Step 1: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrors({ submit: 'Failed to load payment gateway. Check your internet connection.' });
        setLoading(false);
        return;
      }

      // Step 2: Create payment order
      const orderResponse = await api.post('/auth/tpo/create-payment-order', {
        amount: form.amount,
      });

      if (!orderResponse.data.success) {
        throw new Error('Failed to create payment order');
      }

      const { order, key_id } = orderResponse.data;

      // Step 3: Open Razorpay checkout
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'College Placement System',
        description: 'TPO Registration Payment',
        order_id: order.id,
        handler: async function (response) {
          // Step 4: After successful payment, complete signup
          try {
            const signupResponse = await api.post('/auth/tpo/signup', {
              collegeName: form.collegeName,
              collegeEmailDomain: form.collegeEmail,
              address: form.address,
              tpoName: form.tpoName,
              tpoEmail: form.tpoEmail,
              tpoPhone: form.phone,
              password: form.password,
              amount: form.amount,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Set codes from backend response
            setCodes({
              studentCode: signupResponse.data.studentCode,
              facultyCode: signupResponse.data.facultyCode,
            });

            // Store user info in localStorage
            localStorage.setItem('token', signupResponse.data.token);
            localStorage.setItem('tpo_token', signupResponse.data.token);
            localStorage.setItem('tpo_college', form.collegeName);
            localStorage.setItem('tpo_user', form.tpoName);
            localStorage.setItem('tpo_email', form.tpoEmail);

            setLoading(false);
          } catch (error) {
            console.error('Signup error:', error);
            setErrors({ 
              submit: error.response?.data?.message || 'Signup failed after payment. Please contact support.' 
            });
            setLoading(false);
          }
        },
        prefill: {
          name: form.tpoName,
          email: form.tpoEmail,
          contact: form.phone,
        },
        theme: {
          color: '#10b981', // emerald-600
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setErrors({ submit: 'Payment cancelled. Please try again.' });
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        setErrors({ submit: `Payment failed: ${response.error.description}` });
        setLoading(false);
      });

      paymentObject.open();

    } catch (error) {
      console.error('Error:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'An error occurred. Please try again.' 
      });
      setLoading(false);
    }
  };

  // Success Screen (unchanged)
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
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Signup Form (rest remains the same, just showing the submit button section)
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="text-emerald-600">TPO</span> College Signup
          </h1>
          <p className="text-gray-600">Register your college and start managing placements</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-emerald-100">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8">
            <h2 className="text-2xl font-bold text-white">College & TPO Registration</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* All your existing form fields here... */}
            
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
                  disabled={loading}
                  required
                />

                <Input
                  label="College Email Domain"
                  name="collegeEmail"
                  value={form.collegeEmail}
                  onChange={handleChange}
                  placeholder="e.g., mnnit.ac.in"
                  error={errors.collegeEmail}
                  disabled={loading}
                  required
                />

                <Input
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g., Allahabad, UP, India"
                  error={errors.address}
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Payment & Security Section */}
            <div className="border-b-2 border-gray-200 pb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">💳</span>
                <h3 className="text-xl font-bold text-gray-900">Payment & Security</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-emerald-50 p-5 rounded-lg border-2 border-emerald-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Payment
                  </label>
                  <div className="text-3xl font-bold text-emerald-700">
                    ₹{form.amount.toLocaleString()}
                  </div>
                  <p className="text-gray-600 text-xs mt-2">One-time payment for annual subscription</p>
                  <p className="text-emerald-600 text-xs mt-1 font-semibold">🔒 Secure payment via Razorpay</p>
                </div>

                <Input
                  label="Create Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter a strong password"
                  error={errors.password}
                  disabled={loading}
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
              disabled={loading}
              className="w-full"
              type="submit"
            >
              {loading ? 'Processing Payment...' : 'Proceed to Payment →'}
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
            <div className="text-4xl mb-3">💳</div>
            <h4 className="font-bold text-gray-900 mb-2">Pay Securely</h4>
            <p className="text-gray-600 text-sm">Complete payment via Razorpay</p>
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