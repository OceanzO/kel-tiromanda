'use client';

/**
 * /auth/confirm — Client-side handler for Supabase hash-based auth links.
 *
 * Supabase email links (magic link, password recovery) may use the
 * "implicit flow" which puts the session tokens in the URL hash fragment
 * (e.g. #access_token=...&type=recovery). Hash fragments are never sent
 * to the server, so they must be parsed on the client.
 *
 * This page:
 *  1. Reads the hash fragment from window.location.hash
 *  2. Exchanges the token with Supabase to establish a session
 *  3. If type === 'recovery' → redirects to /update-password
 *  4. Otherwise → redirects to /admin (normal sign-in)
 *  5. On any error → redirects to /login?error=link_invalid
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa';

export default function AuthConfirmPage() {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function handleAuth() {
      // 1. Cek PKCE flow (code di URL search params)
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      const nextParam = searchParams.get('next') || '/update-password';

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setErrorMsg(error.message);
          setStatus('error');
          setTimeout(() => router.replace('/login?error=link_invalid'), 3000);
          return;
        }
        // Jika sukses exchange code, redirect ke update-password
        router.replace('/update-password');
        return;
      }

      // 2. Cek Implicit flow (tokens di hash fragment)
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1)); // remove leading '#'
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        const errorCode = params.get('error');
        const errorDescription = params.get('error_description');

        if (errorCode || errorDescription) {
          setErrorMsg(errorDescription ?? errorCode ?? 'Link tidak valid.');
          setStatus('error');
          setTimeout(() => router.replace('/login?error=link_invalid'), 3000);
          return;
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setErrorMsg(error.message);
            setStatus('error');
            setTimeout(() => router.replace('/login?error=link_invalid'), 3000);
            return;
          }

          if (type === 'recovery') {
            router.replace('/update-password');
          } else {
            router.replace('/admin');
          }
          return;
        }
      }

      // 3. Jika tidak ada code maupun hash, berarti link tidak valid
      setErrorMsg('Tidak ada token autentikasi yang ditemukan.');
      setStatus('error');
      setTimeout(() => router.replace('/login?error=link_invalid'), 3000);
    }

    handleAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at 30% 30%, #1a3a25 0%, #0d1f15 55%, #0a1a10 100%)',
      }}
    >
      <div
        className="w-full max-w-[380px] rounded-2xl p-8 text-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        {status === 'loading' ? (
          <>
            <div className="w-14 h-14 rounded-full bg-amber-400/10 flex items-center justify-center mx-auto mb-5">
              <FaSpinner className="text-amber-400 text-2xl animate-spin" />
            </div>
            <h2 className="font-heading text-lg font-bold text-white mb-2">
              Memverifikasi tautan...
            </h2>
            <p className="text-sm text-white/40">
              Mohon tunggu sebentar.
            </p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
              <FaExclamationCircle className="text-red-400 text-2xl" />
            </div>
            <h2 className="font-heading text-lg font-bold text-white mb-2">
              Tautan Tidak Valid
            </h2>
            <p className="text-sm text-white/40 mb-1">
              {errorMsg || 'Tautan ini sudah kedaluwarsa atau tidak valid.'}
            </p>
            <p className="text-xs text-amber-400/60">
              Mengalihkan ke halaman masuk...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
