import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function TPOLogin() {
  const [form, setForm] = useState({ email: '', password: '', tpoCode: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be 6+ characters';
    if (!form.tpoCode.trim()) errs.tpoCode = 'TPO code required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    localStorage.setItem('tpo_token', 'mock-token-' + Date.now());
    navigate('/tpo/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-50 rounded-xl shadow-md p-10">

        <h1 className="text-3xl font-bold text-center text-gray-900">TPO Login</h1>
        <p className="text-gray-600 text-center text-sm mt-1">Access your TPO portal</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            error={errors.email}
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
            required
          />

          <Input
            label="TPO Code"
            name="tpoCode"
            value={form.tpoCode}
            onChange={handleChange}
            placeholder="TPO Code"
            error={errors.tpoCode}
            required
          />

          <Button size="lg">Login</Button>

          <p className="text-center text-gray-600 text-sm">
            Don’t have an account?{' '}
            <Link className="text-green-700 font-semibold hover:underline" to="/tpo/signup">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
