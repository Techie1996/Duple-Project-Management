import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Register() {
  const navigate = useNavigate();
  const { register: doRegister } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await doRegister(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-8 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Layers className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-slate-800">PM Tool</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
            <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
            <p className="mt-1 text-sm text-slate-500">Get started with your free account</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <Input
                label="Name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}
              <Button type="submit" className="w-full" loading={loading}>
                Create account
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        <div className="hidden lg:block">
          <div className="relative h-[520px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 shadow-soft">
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.35)_1px,transparent_0)] [background-size:18px_18px]" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-sm font-medium text-primary-100">Join your workspace</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Create projects in minutes.</h2>
              <p className="mt-3 text-sm text-primary-100/90">
                Invite teammates, create boards, and start tracking tasks instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
