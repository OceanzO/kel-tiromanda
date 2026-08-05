'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { FaEnvelope, FaLock, FaSignInAlt, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? 'Email atau kata sandi salah. Silakan coba lagi.'
          : error.message
        );
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1F3A2C 0%, #162a1f 50%, #0f1c15 100%)' }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]" />
        {/* Toraja pattern overlay */}
        <div className="absolute inset-0 section-pattern opacity-5" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Login Card */}
        <div className="relative bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/40">
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />

          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-5 relative">
              <Image
                src="/logo-custom.png"
                alt="Logo Kelurahan Tiromanda"
                width={80}
                height={80}
                className="w-full h-full object-contain drop-shadow-lg"
                priority
              />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
              Dashboard Admin
            </h1>
            <p className="text-white/50 text-sm">
              Kelurahan Tiromanda — Tana Toraja
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-xs mt-0.5">!</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white/70 mb-2">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white/70 mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-300 flex items-center justify-center gap-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  Masuk ke Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} Kelurahan Tiromanda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
