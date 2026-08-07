'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FaLock, FaEye, FaEyeSlash, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

export default function UpdatePasswordPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const supabase = createClient();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Verify user has an active recovery session
  useEffect(() => {
    setMounted(true);

    // Listen for auth state changes (handles PASSWORD_RECOVERY event)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Session valid untuk recovery — boleh tetap di halaman ini
        return;
      }
      if (event === 'SIGNED_OUT') {
        // Sudah logout — redirect ke login
        router.replace('/login');
      }
    });

    // Juga cek sesi langsung
    supabase.auth.getSession().then(({ data: { session } }) => {
      // If no session at all, redirect to login
      if (!session) {
        router.replace('/login?error=link_invalid');
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError(language === 'id' ? 'Kata sandi tidak cocok.' : 'Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError(
        language === 'id'
          ? 'Kata sandi minimal 6 karakter.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

      if (updateError) {
        const msg = updateError.message.toLowerCase();
        if (msg.includes('different from the old password')) {
          setError(
            language === 'id'
              ? 'Kata sandi baru harus berbeda dari yang lama.'
              : 'New password must be different from the old one.'
          );
        } else if (msg.includes('password should be at least')) {
          setError(
            language === 'id'
              ? 'Kata sandi minimal 6 karakter.'
              : 'Password must be at least 6 characters.'
          );
        } else {
          setError(updateError.message);
        }
        return;
      }

      // Success — sign out to clear recovery session, then redirect
      setSuccess(true);
      await supabase.auth.signOut();
      setTimeout(() => {
        router.replace('/login');
      }, 2500);
    } catch {
      setError(
        language === 'id'
          ? 'Terjadi kesalahan. Silakan coba lagi.'
          : 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsNoMatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const inputBase =
    'w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-200 border';
  const inputNormal =
    inputBase + ' bg-white/8 border-white/10 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at 30% 30%, #1a3a25 0%, #0d1f15 55%, #0a1a10 100%)',
      }}
    >
      {/* Subtle blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div
        className={`relative w-full max-w-[420px] transition-all duration-500 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
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
          {success ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
                <FaCheckCircle className="text-3xl text-emerald-400" />
              </div>
              <h2 className="font-heading text-xl font-bold text-white mb-2">
                {language === 'id' ? 'Kata Sandi Diperbarui!' : 'Password Updated!'}
              </h2>
              <p className="text-sm text-white/45 leading-relaxed">
                {language === 'id'
                  ? 'Kata sandi Anda berhasil diperbarui. Mengalihkan ke halaman masuk...'
                  : 'Your password has been updated. Redirecting to login...'}
              </p>
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-amber-400/60">
                <FaSpinner className="animate-spin" />
                <span>{language === 'id' ? 'Mengalihkan...' : 'Redirecting...'}</span>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-7">
                <div className="w-11 h-11 rounded-xl bg-amber-400/10 flex items-center justify-center mb-5">
                  <FaLock className="text-amber-400 text-lg" />
                </div>
                <h1 className="font-heading text-2xl font-bold text-white mb-1">
                  {language === 'id' ? 'Buat Kata Sandi Baru' : 'Create New Password'}
                </h1>
                <p className="text-sm text-white/40">
                  {language === 'id'
                    ? 'Masukkan kata sandi baru Anda. Minimal 6 karakter.'
                    : 'Enter your new password. At least 6 characters.'}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <FaExclamationCircle className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    {language === 'id' ? 'Kata Sandi Baru' : 'New Password'}
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={inputNormal}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                    >
                      {showNew ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    {language === 'id' ? 'Konfirmasi Kata Sandi' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={
                        inputBase +
                        (passwordsNoMatch
                          ? ' bg-red-500/8 border-red-500/30 focus:border-red-400/50 focus:ring-2 focus:ring-red-400/10'
                          : passwordsMatch
                          ? ' bg-emerald-500/8 border-emerald-500/30 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10'
                          : ' bg-white/8 border-white/10 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10')
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {/* Match indicator */}
                  {confirmPassword && (
                    <p
                      className={`mt-1.5 text-xs flex items-center gap-1.5 ${
                        passwordsMatch ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {passwordsMatch ? (
                        <><FaCheckCircle /> {language === 'id' ? 'Kata sandi cocok' : 'Passwords match'}</>
                      ) : (
                        <><FaExclamationCircle /> {language === 'id' ? 'Kata sandi tidak cocok' : "Passwords don't match"}</>
                      )}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || passwordsNoMatch}
                  className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #E3A73A 0%, #c98f20 100%)',
                    boxShadow: '0 8px 24px rgba(227,167,58,0.25)',
                    color: '#fff',
                  }}
                >
                  {loading ? (
                    <><FaSpinner className="animate-spin" /> {language === 'id' ? 'Menyimpan...' : 'Saving...'}</>
                  ) : (
                    <><FaLock /> {language === 'id' ? 'Simpan Kata Sandi Baru' : 'Save New Password'}</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
