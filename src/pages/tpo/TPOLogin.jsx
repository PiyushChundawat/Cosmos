import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { tpoAuthAPI } from '../../services/api';

export default function TPOLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Valid email required';
    if (!form.password || form.password.length < 6)
      errs.password = 'Password must be 6+ chars';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const response = await tpoAuthAPI.login(form.email, form.password);
      localStorage.setItem('tpo_token', response.data.token);
      navigate('/tpo/student-analytics', { replace: true });
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">TPO Login</h1>
            <p className="text-emerald-100">Training & Placement Office</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@college.edu"
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              required
            />

            {errors.submit && (
              <p className="text-red-500 text-sm font-medium">{errors.submit}</p>
            )}

            <Button size="lg" loading={loading}>
              Login
            </Button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/tpo/signup"
                  className="text-emerald-600 font-bold hover:text-emerald-700"
                >
                  TPO Signup
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}