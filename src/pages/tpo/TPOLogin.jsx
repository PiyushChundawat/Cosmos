import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import HomeButton from '../../components/HomeButton';
import api from '../../api/axios';

export default function TPOLogin() {
  const [form, setForm] = useState({ email: '', password: '', tpoCode: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Valid email required';
    }
    if (!form.password || form.password.length < 6) {
      errs.password = 'Password must be 6+ characters';
    }
    if (!form.tpoCode.trim()) {
      errs.tpoCode = 'TPO code required';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/tpo/login', {
        email: form.email,
        password: form.password,
        tpoCode: form.tpoCode,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tpo_token', response.data.token);
      localStorage.setItem('tpo_user', response.data.user.name);
      localStorage.setItem('tpo_email', response.data.user.email);
      localStorage.setItem(
        'tpo_college',
        response.data.user.collegeName || 'College'
      );

      navigate('/tpo/dashboard', { replace: true });
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          'Login failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="fixed top-4 right-4 z-50">
        <HomeButton />
      </div>

      <div className="flex items-center justify-center p-6 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-sm hover:shadow-md p-6">
          
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              TPO Login
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Access your TPO portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              error={errors.email}
              disabled={loading}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              error={errors.password}
              disabled={loading}
              required
            />

            <Input
              label="TPO Code"
              name="tpoCode"
              value={form.tpoCode}
              onChange={handleChange}
              placeholder="TPO Code"
              error={errors.tpoCode}
              disabled={loading}
              required
            />

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">
                  {errors.submit}
                </p>
              </div>
            )}

            <Button
              size="lg"
              loading={loading}
              disabled={loading}
              type="submit"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-center text-gray-600 text-sm">
              Don&apos;t have an account?{' '}
              <Link
                className="text-green-700 font-semibold hover:underline"
                to="/tpo/signup"
              >
                Sign up
              </Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
