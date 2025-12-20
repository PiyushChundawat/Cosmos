import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
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
    if (!form.collegeName.trim()) errs.collegeName = 'College name required';
    if (!form.collegeEmail.trim() || !/\.ac\.in|\.edu/.test(form.collegeEmail))
      errs.collegeEmail = 'Valid college email domain required';
    if (!form.address.trim()) errs.address = 'Address required';
    if (!form.tpoName.trim()) errs.tpoName = 'Full name required';
    if (!form.tpoEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.tpoEmail))
      errs.tpoEmail = 'Valid email required';
    if (!form.phone.trim() || form.phone.length < 10)
      errs.phone = 'Valid phone number required';
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
      const response = await api.post('/auth/tpo/signup', {
        collegeName: form.collegeName,
        collegeEmailDomain: form.collegeEmail,
        address: form.address,
        tpoName: form.tpoName,
        tpoEmail: form.tpoEmail,
        tpoPhone: form.phone,
        password: form.password,
        amount: form.amount,
      });

      setCodes({
        studentCode: response.data.studentCode || response.data.codes?.studentCode,
        facultyCode: response.data.facultyCode || response.data.codes?.facultyCode,
      });

      localStorage.setItem('tpo_token', response.data.token);
      localStorage.setItem('tpo_college', form.collegeName);
      localStorage.setItem('tpo_user', form.tpoName);
      localStorage.setItem('tpo_email', form.tpoEmail);

    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Signup failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUCCESS SCREEN ================= */
  if (codes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
        <Card className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Signup Successful!</h2>
          <p className="text-gray-600 mb-8">Your college has been registered</p>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border-2 border-blue-300 p-5 rounded-xl">
              <p className="text-sm font-semibold mb-2">📚 Student Code</p>
              <p className="text-3xl font-bold text-blue-700 font-mono">{codes.studentCode}</p>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-300 p-5 rounded-xl">
              <p className="text-sm font-semibold mb-2">👨‍🏫 Faculty Code</p>
              <p className="text-3xl font-bold text-indigo-700 font-mono">{codes.facultyCode}</p>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate('/tpo/dashboard', { replace: true })}
          >
            Go to Dashboard →
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full mt-3"
            onClick={() => navigate('/tpo/login', { replace: true })}
          >
            Login
          </Button>
        </Card>
      </div>
    );
  }

  /* ================= SIGNUP FORM ================= */
  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-800">
            TPO College Signup
          </h1>
          <p className="text-gray-600 mt-2">
            Register your college & manage placements professionally
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* College Section */}
            <h3 className="text-xl font-bold text-blue-700">🏫 College Details</h3>
            <Input label="College Name" name="collegeName" value={form.collegeName} onChange={handleChange} error={errors.collegeName} />
            <Input label="College Email Domain" name="collegeEmail" value={form.collegeEmail} onChange={handleChange} error={errors.collegeEmail} />
            <Input label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} />

            {/* TPO Section */}
            <h3 className="text-xl font-bold text-blue-700 pt-4">👤 TPO Details</h3>
            <Input label="Full Name" name="tpoName" value={form.tpoName} onChange={handleChange} error={errors.tpoName} />
            <Input label="Email" name="tpoEmail" value={form.tpoEmail} onChange={handleChange} error={errors.tpoEmail} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />

            {/* Security */}
            <h3 className="text-xl font-bold text-blue-700 pt-4">🔐 Security</h3>
            <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} />

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-700">{errors.submit}</p>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Creating Account...' : 'Register College'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already registered?{' '}
              <Link to="/tpo/login" className="text-blue-600 font-semibold underline">
                Login here
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
