'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function LoginModal() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const open = () => setShowLogin(true);
    window.addEventListener('show-login', open);
    return () => window.removeEventListener('show-login', open);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authClient.signIn.email(
        { email, password },
        {
          onRequest: () => {
            setLoading(true);
            setError('');
          },
          onResponse: () => setLoading(false),
          onSuccess: () => {
            setShowLogin(false);
            window.dispatchEvent(new Event('auth-logged-in'));
            router.refresh();
          },
          onError: (ctx) => {
            setError(ctx.error.message);
          },
        }
      );
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowLogin(false);
    }
  };

  if (!showLogin) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)',
      }}
      onClick={handleOverlayClick}
    >
      <div className="glass-card w-full max-w-sm mx-4 p-6 scale-in relative">
        <button
          className="absolute top-4 right-4 text-white/60 hover:text-white text-xl p-1 rounded-full hover:bg-white/10 transition-all hover:rotate-90"
          onClick={() => setShowLogin(false)}
        >
          ×
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gradient mb-2">Welcome Back</h2>
          <p className="text-white/70 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label text-sm" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input text-sm py-2.5"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label text-sm" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input text-sm py-2.5"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {error && (
            <div className="text-red-400 text-center text-xs bg-red-400/10 border border-red-400/20 rounded-lg p-2">
              {error}
            </div>
          )}
        </form>

        <div className="text-center mt-4">
          <a
            href="#"
            className="text-white/60 hover:text-white text-xs transition-colors"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
