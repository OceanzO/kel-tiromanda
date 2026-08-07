'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  FaEnvelope, FaLock, FaSignInAlt, FaSpinner,
  FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle,
  FaExclamationCircle, FaShieldAlt,
} from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

// ─── Error translation ────────────────────────────────────────────────────────
const getAuthError = (msg: string, lang: string) => {
  const m = msg.toLowerCase();
  if (m.includes('rate limit'))
    return lang === 'id'
      ? 'Terlalu banyak permintaan. Tunggu beberapa saat lalu coba lagi.'
      : 'Too many requests. Please wait a moment and try again.';
  if (m.includes('invalid login credentials'))
    return lang === 'id'
      ? 'Email atau kata sandi salah. Silakan coba lagi.'
      : 'Incorrect email or password. Please try again.';
  return msg;
};

// ─── Input style ──────────────────────────────────────────────────────────────
const inputCls =
  'w-full py-3.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-200 bg-white/8 border border-white/10 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10';

// ─── Inner (needs useSearchParams) ───────────────────────────────────────────
function LoginInner() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for link_invalid error from /auth/callback
    if (searchParams.get('error') === 'link_invalid') {
      setError(
        language === 'id'
          ? 'Tautan reset tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.'
          : 'The reset link is invalid or has expired. Please request a new one.'
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(getAuthError(err.message, language));
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError(language === 'id' ? 'Terjadi kesalahan. Silakan coba lagi.' : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password ────────────────────────────────────────────────────────
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(language === 'id' ? 'Masukkan alamat email Anda.' : 'Please enter your email address.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        // ✅ Redirect ke /auth/confirm untuk implicit flow (hash fragment)
        redirectTo: `${window.location.origin}/auth/confirm`,
      });
      if (err) {
        setError(getAuthError(err.message, language));
      } else {
        setSuccessMsg('sent');
      }
    } catch {
      setError(language === 'id' ? 'Terjadi kesalahan. Silakan coba lagi.' : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchView = (v: 'login' | 'forgot') => {
    setView(v);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at 30% 25%, #1a3a25 0%, #0d1f15 55%, #0a1a10 100%)',
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[450px] h-[450px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div
        className={`relative w-full max-w-[420px] transition-all duration-500 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* ─ Login Card ────────────────────────────────────────────────────── */}
        {view === 'login' && (
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Title */}
            <div className="mb-7">
              <h1 className="font-heading text-2xl md:text-[28px] font-bold text-white mb-1.5 leading-tight">
                {language === 'id' ? 'Masuk ke Dashboard' : 'Login to Dashboard'}
              </h1>
              <p className="text-sm text-white/40">
                {language === 'id' ? 'Panel admin Kelurahan Tiromanda' : 'Tiromanda Village admin panel'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <FaExclamationCircle className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kkn116tiromanda@gmail.com"
                    required
                    className={inputCls + ' pl-11 pr-4'}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/60 mb-2">
                  {language === 'id' ? 'Kata Sandi' : 'Password'}
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm pointer-events-none" />
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={inputCls + ' pl-11 pr-12'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Forgot link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchView('forgot')}
                  className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {language === 'id' ? 'Lupa kata sandi?' : 'Forgot password?'}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                style={{
                  background: 'linear-gradient(135deg, #E3A73A 0%, #c98f20 100%)',
                  boxShadow: '0 8px 24px rgba(227,167,58,0.25)',
                }}
              >
                {loading ? (
                  <><FaSpinner className="animate-spin" /> {language === 'id' ? 'Memproses...' : 'Processing...'}</>
                ) : (
                  <><FaSignInAlt /> {language === 'id' ? 'Masuk ke Dashboard' : 'Login to Dashboard'}</>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 flex flex-col items-center justify-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium text-white/35 hover:text-white/70 transition-colors"
              >
                <FaArrowLeft className="text-xs" />
                {language === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
              </Link>
              <div className="flex items-center justify-center gap-2 text-xs text-white/20">
                <FaShieldAlt />
                <span>{language === 'id' ? 'Akses aman terenkripsi' : 'Secure encrypted access'}</span>
              </div>
            </div>
          </div>
        )}

        {/* ─ Forgot Password Card ───────────────────────────────────────────── */}
        {view === 'forgot' && (
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Icon + Title */}
            <div className="mb-7">
              <div className="w-11 h-11 rounded-xl bg-amber-400/10 flex items-center justify-center mb-5">
                <FaEnvelope className="text-amber-400 text-lg" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-white mb-1.5">
                {language === 'id' ? 'Pemulihan Kata Sandi' : 'Password Recovery'}
              </h1>
              <p className="text-sm text-white/40 leading-relaxed">
                {language === 'id'
                  ? 'Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.'
                  : "Enter your email and we'll send you a link to reset your password."}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <FaExclamationCircle className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {successMsg === 'sent' && (
              <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                <FaCheckCircle className="shrink-0 mt-0.5" />
                <span>
                  {language === 'id'
                    ? 'Tautan reset dikirim ke email Anda. Periksa kotak masuk atau folder spam.'
                    : 'Reset link sent to your email. Check your inbox or spam folder.'}
                </span>
              </div>
            )}

            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-white/60 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm pointer-events-none" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kkn116tiromanda@gmail.com"
                    required
                    className={inputCls + ' pl-11 pr-4'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || successMsg === 'sent'}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #E3A73A 0%, #c98f20 100%)',
                  boxShadow: '0 8px 24px rgba(227,167,58,0.25)',
                }}
              >
                {loading ? (
                  <><FaSpinner className="animate-spin" /> {language === 'id' ? 'Mengirim...' : 'Sending...'}</>
                ) : (
                  <><FaEnvelope /> {language === 'id' ? 'Kirim Tautan Reset' : 'Send Reset Link'}</>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => switchView('login')}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/35 hover:text-white/70 transition-colors"
              >
                <FaArrowLeft className="text-xs" />
                {language === 'id' ? 'Kembali ke Halaman Masuk' : 'Back to Login'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Export wrapped in Suspense ───────────────────────────────────────────────
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d1f15' }}>
          <FaSpinner className="animate-spin text-3xl text-amber-400" />
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
