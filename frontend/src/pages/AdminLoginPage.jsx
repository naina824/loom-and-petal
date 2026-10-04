import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('dharmakkollanainarao@gmail.com');
    setPassword('Nainarao123');
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blush-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-white shadow-soft mx-auto flex items-center justify-center text-3xl">
          🧶
        </div>
        <h2 className="font-serif text-3xl font-bold text-warmbrown-900 tracking-tight">
          Artisan Studio Portal
        </h2>
        <p className="text-xs text-warmbrown-600">
          Secure admin dashboard for managing creations, inventory &amp; enquiries.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-cream-200 shadow-soft-lg space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-warmbrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dharmakkollanainarao@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-warmbrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-warmbrown-900 hover:bg-warmbrown-800 text-cream-50 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-soft"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Box */}
          <div className="pt-3 border-t border-cream-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 rounded-lg bg-cream-100 hover:bg-cream-200 text-[11px] font-semibold text-warmbrown-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blush-500" />
              <span>Fill Default Admin Credentials (`dharmakkollanainarao@gmail.com`)</span>
            </button>

            <Link
              to="/"
              className="text-center text-xs text-warmbrown-500 hover:text-warmbrown-800 transition-colors mt-2"
            >
              ← Back to Customer Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
