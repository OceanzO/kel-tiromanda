'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FaEnvelope, FaLock, FaSignInAlt, FaSpinner, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const { language } = useLanguage();
  const [view, setView] = useState<'login' | 'forgot_password' | 'update_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Helper to translate Supabase Auth errors
  const getAuthErrorMessage = (errorMsg: string, lang: string) => {
    const msg = errorMsg.toLowerCase();
    if (msg.includes('rate limit')) {
      return lang === 'id' 
        ? 'Terlalu banyak permintaan pengiriman email. Silakan tunggu beberapa saat dan coba lagi.' 
        : 'Too many email requests. Please wait a moment and try again.';
    }
    if (msg.includes('invalid login credentials')) {
      return lang === 'id' ? 'Email atau kata sandi salah. Silakan coba lagi.' : 'Incorrect email or password. Please try again.';
    }
    if (msg.includes('password should be at least')) {
      return lang === 'id' ? 'Kata sandi minimal harus 6 karakter.' : 'Password must be at least 6 characters.';
    }
    if (msg.includes('different from the old password')) {
      return lang === 'id' ? 'Kata sandi baru harus berbeda dari yang lama.' : 'New password must be different from the old one.';
    }
    return errorMsg;
  };

  const getSuccessMessage = (msgKey: string, lang: string) => {
    if (msgKey === 'reset_sent') {
      return lang === 'id' 
        ? 'Tautan untuk mengatur ulang kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.' 
        : 'A link to reset your password has been sent to your email. Please check your inbox or spam folder.';
    }
    if (msgKey === 'password_updated') {
      return lang === 'id' 
        ? 'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.' 
        : 'Password updated successfully! Please log in with your new password.';
    }
    return msgKey;
  };

  // Handle Supabase password recovery flows
  useEffect(() => {
    // 1. Listen for implicit flow recovery
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setView('update_password');
      }
    });

    // 2. Check for PKCE code in URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) {
          setView('update_password');
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    } else {
      // Also check hash for access_token just in case onAuthStateChange is slow
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        setView('update_password');
      }
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(language === 'id' ? 'Kata sandi tidak cocok.' : 'Passwords do not match.');
      return;
    }
    
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg('password_updated');
        setTimeout(() => {
          setView('login');
          setPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setSuccessMsg('');
        }, 3000);
      }
    } catch {
      setError(language === 'id' ? 'Terjadi kesalahan saat memperbarui kata sandi.' : 'An error occurred while updating the password.');
    } finally {
      setLoading(false);
    }
  };

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
        setError(getAuthErrorMessage(error.message, language));
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(language === 'id' ? 'Silakan masukkan alamat email Anda.' : 'Please enter your email address.');
      return;
    }
    
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg('reset_sent');
      }
    } catch {
      setError(language === 'id' ? 'Terjadi kesalahan saat meminta reset kata sandi.' : 'An error occurred while requesting password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar forceBackground />
      <main className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center relative overflow-hidden bg-background transition-colors duration-300">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md mx-4 mt-8 md:mt-0">
          {view === 'login' ? (
            /* Login Card */
            <div className="relative bg-[var(--card-bg)] rounded-3xl p-8 md:p-10 shadow-[var(--card-shadow)] border border-[var(--glass-border)] transition-colors duration-300">
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2 transition-colors duration-300">
                  {language === 'id' ? 'Dashboard Admin' : 'Admin Dashboard'}
                </h1>
                <p className="text-foreground-light text-sm transition-colors duration-300">
                  {language === 'id' ? 'Kelurahan Tiromanda — Tana Toraja' : 'Tiromanda Village — Tana Toraja'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-xs mt-0.5 font-bold">!</span>
                  {getAuthErrorMessage(error, language)}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2 transition-colors duration-300">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted text-sm transition-colors duration-300" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-[var(--background-alt)] border border-[var(--glass-border)] rounded-xl text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 text-sm"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2 transition-colors duration-300">
                    {language === 'id' ? 'Kata Sandi' : 'Password'}
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted text-sm transition-colors duration-300" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-12 py-3.5 bg-[var(--background-alt)] border border-[var(--glass-border)] rounded-xl text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setView('forgot_password'); setError(''); setSuccessMsg(''); }}
                    className="text-sm text-accent hover:text-primary transition-colors font-medium"
                  >
                    {language === 'id' ? 'Lupa kata sandi?' : 'Forgot password?'}
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-accent hover:bg-primary text-white font-bold rounded-xl shadow-[var(--card-shadow)] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      {language === 'id' ? 'Memproses...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <FaSignInAlt />
                      {language === 'id' ? 'Masuk ke Dashboard' : 'Login to Dashboard'}
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : view === 'forgot_password' ? (
            /* Forgot Password Card */
            <div className="relative bg-[var(--card-bg)] rounded-[24px] p-8 md:p-10 shadow-[var(--card-shadow)] border border-[var(--glass-border)] transition-colors duration-300">
              
              {/* Error/Success Messages */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-xs mt-0.5 font-bold">!</span>
                  {getAuthErrorMessage(error, language)}
                </div>
              )}
              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs mt-0.5 font-bold">✓</span>
                  {getSuccessMessage(successMsg, language)}
                </div>
              )}

              {/* Title & Description */}
              <div className="text-center mb-6">
                <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2 transition-colors duration-300">
                  {language === 'id' ? 'Pemulihan Kata Sandi' : 'Password Recovery'}
                </h2>
                <p className="text-foreground-light text-sm transition-colors duration-300 leading-relaxed px-2">
                  {language === 'id' 
                    ? 'Jangan khawatir! Masukkan alamat email Anda yang terdaftar, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.' 
                    : 'Don’t worry! Enter your registered email address, and we will send you a link to reset your password.'}
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-semibold text-foreground mb-2 transition-colors duration-300">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted text-sm transition-colors duration-300" />
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-[var(--background-alt)] border border-[var(--glass-border)] rounded-xl text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-accent hover:bg-primary text-white font-bold rounded-xl shadow-[var(--card-shadow)] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      {language === 'id' ? 'Memproses...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <FaEnvelope />
                      {language === 'id' ? 'Kirim Tautan Reset' : 'Send Reset Link'}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }}
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
                >
                  <FaArrowLeft className="text-xs" />
                  {language === 'id' ? 'Kembali ke Masuk' : 'Back to Login'}
                </button>
              </div>
            </div>
          ) : (
            /* Update Password Card */
            <div className="relative bg-[var(--card-bg)] rounded-[24px] p-8 md:p-10 shadow-[var(--card-shadow)] border border-[var(--glass-border)] transition-colors duration-300">
              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2 transition-colors duration-300">
                  {language === 'id' ? 'Buat Kata Sandi Baru' : 'Create New Password'}
                </h2>
                <p className="text-foreground-light text-sm transition-colors duration-300 leading-relaxed px-2">
                  {language === 'id' 
                    ? 'Silakan masukkan kata sandi baru Anda.' 
                    : 'Please enter your new password.'}
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-xs mt-0.5 font-bold">!</span>
                  {getAuthErrorMessage(error, language)}
                </div>
              )}
              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs mt-0.5 font-bold">✓</span>
                  {getSuccessMessage(successMsg, language)}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-5">
                {/* New Password */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-semibold text-foreground mb-2 transition-colors duration-300">
                    {language === 'id' ? 'Kata Sandi Baru' : 'New Password'}
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted text-sm transition-colors duration-300" />
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-12 py-3.5 bg-[var(--background-alt)] border border-[var(--glass-border)] rounded-xl text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-semibold text-foreground mb-2 transition-colors duration-300">
                    {language === 'id' ? 'Konfirmasi Kata Sandi' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted text-sm transition-colors duration-300" />
                    <input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-12 py-3.5 bg-[var(--background-alt)] border border-[var(--glass-border)] rounded-xl text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-accent hover:bg-primary text-white font-bold rounded-xl shadow-[var(--card-shadow)] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      {language === 'id' ? 'Memproses...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <FaLock />
                      {language === 'id' ? 'Simpan Kata Sandi' : 'Save Password'}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }}
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
                >
                  <FaArrowLeft className="text-xs" />
                  {language === 'id' ? 'Kembali ke Masuk' : 'Back to Login'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
