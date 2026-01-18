import { useState } from 'react';
import { motion } from 'framer-motion';
import { login } from '../api/client';
import { decodeJwt } from '../utils/jwt';
import { BRANDING } from '../config/branding';



import logo from '../assets/cloud7-logo-material.svg';
import illustration from '../assets/login-illustration-drive.svg';
import illustration2 from '../assets/login-illustration-drive2.svg';

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    try {
      setLoading(true);
      setError(null);

      const token = await login(email, password);
      localStorage.setItem('token', token);

      const payload = decodeJwt(token);
      onLogin({
        userId: payload.userId,
        firstName: payload.firstName,
        lastName: payload.lastName
      });
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-start md:items-center justify-center px-6 py-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-gray-200">

        {/* LEFT — Branding */}
          <div className="flex md:flex flex-col justify-center px-10 pt-6 bg-white">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 3, ease: 'easeOut' }}
            >
          <img src={logo} className="w-32 mb-6" />

            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {BRANDING.app.tagline}
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4 md:mb-8">
            {BRANDING.app.description}
            </p>


            <img
                src={illustration2}
                alt="Cloud storage illustration"
                className="w-full max-w-sm"
            />
            </motion.div>
          </div>

          {/* RIGHT — Login */}
          <div className="flex flex-col justify-center px-8 py-10">
            <div className="max-w-sm mx-auto w-full">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {BRANDING.auth.login.title}
              </h1>

              <p className="text-sm text-gray-600 mb-6">
                {BRANDING.auth.login.subtitle}
              </p>

              {error && (
                  <p className="text-sm text-red-600 mb-3">{error}</p>
              )}

              <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="
                w-full mb-3 p-3
                border border-gray-300
                rounded-lg
                text-gray-900
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              />

              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="
                w-full mb-5 p-3
                border border-gray-300
                rounded-lg
                text-gray-900
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              />

              <button
                  onClick={submit}
                  disabled={loading}
                  className="
                w-full bg-[#1a73e8]
                text-white py-3 rounded-lg
                font-medium
                hover:bg-blue-600
                transition
                disabled:opacity-60
              "
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

              <div className="mt-6 text-sm text-center text-gray-600">
                Don’t have an account?{' '}
                <button
                    onClick={onSwitch}
                    className="text-blue-600 hover:underline"
                >
                  Create one
                </button>
              </div>

              {/* Vibe coded by 7R — animated */}
              <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                  className="mt-10 text-right"
              >
              <span className="text-[11px] text-gray-400 italic tracking-wide">
                {BRANDING.footer.credit.text}{' '}
                <span className="text-[#1a73e8] font-medium">{BRANDING.footer.credit.author}</span>
              </span>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
  );
}
