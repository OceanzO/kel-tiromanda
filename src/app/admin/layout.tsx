'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  FaHome, FaUsers, FaVenusMars, FaUserTie, FaMountain,
  FaBuilding, FaChartBar, FaImages, FaNewspaper,
  FaSignOutAlt, FaBars, FaTimes, FaChevronRight
} from 'react-icons/fa';

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: FaHome },
  { href: '/admin/statistik', label: 'Statistik Penduduk', icon: FaChartBar },
  { href: '/admin/gender', label: 'Komposisi Gender', icon: FaVenusMars },
  { href: '/admin/perangkat', label: 'Perangkat Kelurahan', icon: FaUserTie },
  { href: '/admin/potensi', label: 'Potensi Kelurahan', icon: FaMountain },
  { href: '/admin/fasilitas', label: 'Fasilitas Umum', icon: FaBuilding },
  { href: '/admin/infografis', label: 'Infografis', icon: FaChartBar },
  { href: '/admin/galeri', label: 'Galeri Foto', icon: FaImages },
  { href: '/admin/berita', label: 'Berita', icon: FaNewspaper },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      }
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const currentPage = ADMIN_NAV.find(item =>
    pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[280px] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'linear-gradient(180deg, #1F3A2C 0%, #162a1f 100%)' }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/logo-custom.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div>
                <span className="font-heading font-bold text-base text-white block leading-tight">
                  Admin Panel
                </span>
                <span className="text-xs text-white/50 block leading-tight">
                  Kel. Tiromanda
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white/60 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-accent/20 text-accent border border-accent/30 shadow-sm shadow-accent/10'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className={`text-base shrink-0 ${isActive ? 'text-accent' : 'text-white/40 group-hover:text-white/70'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <FaChevronRight className="text-[10px] text-accent/60" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-white/10">
          {userEmail && (
            <div className="px-3 py-2 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                  {userEmail[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/80 truncate">Admin</p>
                  <p className="text-[11px] text-white/40 truncate">{userEmail}</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
          >
            <FaSignOutAlt className="text-base" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[280px] min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-foreground/5 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-foreground/5 text-foreground/60 transition-colors"
              >
                <FaBars className="text-lg" />
              </button>
              <div>
                <h1 className="font-heading font-bold text-lg md:text-xl text-foreground">
                  {currentPage?.label || 'Dashboard'}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-foreground-muted mt-0.5">
                  <Link href="/admin" className="hover:text-accent transition-colors">Admin</Link>
                  {currentPage && currentPage.href !== '/admin' && (
                    <>
                      <FaChevronRight className="text-[8px]" />
                      <span className="text-foreground-light">{currentPage.label}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary border border-primary/30 rounded-xl hover:bg-primary/5 transition-all"
              >
                <FaUsers className="text-sm" />
                Lihat Website
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
