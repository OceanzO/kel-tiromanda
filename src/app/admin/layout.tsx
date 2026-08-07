'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  FaHome, FaUsers, FaVenusMars, FaUserTie, FaMountain,
  FaBuilding, FaChartBar, FaImages, FaNewspaper,
  FaSignOutAlt, FaBars, FaTimes, FaChevronRight,
  FaExternalLinkAlt, FaLayerGroup, FaDatabase
} from 'react-icons/fa';

// ─── Navigation structure ────────────────────────────────────────────────────
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Utama',
    items: [
      { href: '/admin', label: 'Dashboard', icon: FaHome, exact: true },
    ],
  },
  {
    label: 'Data Kependudukan',
    items: [
      { href: '/admin/statistik', label: 'Statistik Penduduk', icon: FaChartBar },
      { href: '/admin/gender', label: 'Komposisi Gender', icon: FaVenusMars },
    ],
  },
  {
    label: 'Kelurahan',
    items: [
      { href: '/admin/perangkat', label: 'Perangkat Kelurahan', icon: FaUserTie },
      { href: '/admin/potensi', label: 'Potensi Kelurahan', icon: FaMountain },
      { href: '/admin/fasilitas', label: 'Fasilitas Umum', icon: FaBuilding },
    ],
  },
  {
    label: 'Konten',
    items: [
      { href: '/admin/galeri', label: 'Galeri Foto', icon: FaImages },
      { href: '/admin/berita', label: 'Berita', icon: FaNewspaper },
    ],
  },
];

// Flat list for breadcrumb lookup
const ALL_NAV = NAV_SECTIONS.flatMap((s) => s.items);

function isActive(href: string, pathname: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

// ─── Sidebar Component ───────────────────────────────────────────────────────
function Sidebar({
  open,
  onClose,
  pathname,
  userEmail,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  userEmail: string | null;
  onLogout: () => void;
}) {
  const initial = userEmail ? userEmail[0].toUpperCase() : 'A';

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 w-[270px] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ background: 'linear-gradient(180deg, #172d21 0%, #1F3A2C 40%, #162a1f 100%)' }}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
        <Link href="/admin" onClick={onClose} className="flex flex-col min-w-0">
          <span className="font-heading font-bold text-lg text-white block leading-tight truncate">
            Admin Panel
          </span>
          <span className="text-xs text-white/40 block leading-tight mt-0.5">Kel. Tiromanda</span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white/50 transition-colors shrink-0"
        >
          <FaTimes className="text-sm" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-white/25">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href, pathname, item.exact);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-amber-400/15 text-amber-300 border border-amber-400/20'
                        : 'text-white/50 hover:text-white/90 hover:bg-white/6'
                    }`}
                  >
                    <Icon
                      className={`text-base shrink-0 transition-colors ${
                        active ? 'text-amber-400' : 'text-white/30 group-hover:text-white/60'
                      }`}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="px-3 py-3 border-t border-white/8 space-y-2">
        {/* User Info */}
        {userEmail && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-amber-400/20 overflow-hidden flex items-center justify-center shrink-0 ring-2 ring-amber-400/30">
              <Image
                src="/logo-custom.png"
                alt="Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain bg-white/10 p-0.5"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white/80 truncate">Administrator</p>
              <p className="text-[10px] text-white/35 truncate">{userEmail}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-300 hover:bg-red-500/8 transition-all duration-200"
        >
          <FaSignOutAlt className="text-base shrink-0" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}

// ─── Main Layout ─────────────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email ?? null);
      } else {
        router.push('/login');
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Breadcrumb current page
  const currentPage = ALL_NAV.find((item) =>
    isActive(item.href, pathname, item.exact)
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
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pathname={pathname}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-[270px] min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-foreground/5 px-4 md:px-6 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Left: hamburger + breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-foreground/5 text-foreground/50 transition-colors shrink-0"
              >
                <FaBars className="text-lg" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                  <FaDatabase className="text-[10px] text-accent shrink-0" />
                  <Link href="/admin" className="hover:text-accent transition-colors shrink-0">
                    Admin
                  </Link>
                  {currentPage && currentPage.href !== '/admin' && (
                    <>
                      <FaChevronRight className="text-[8px] shrink-0" />
                      <span className="text-foreground-light truncate">{currentPage.label}</span>
                    </>
                  )}
                </div>
                <h1 className="font-heading font-bold text-base md:text-lg text-foreground leading-tight truncate">
                  {currentPage?.label ?? 'Dashboard'}
                </h1>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-primary border border-primary/25 rounded-xl hover:bg-primary/5 transition-all"
              >
                <FaExternalLinkAlt className="text-sm" />
                Lihat Website
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-foreground/5 text-center">
          <p className="text-xs text-foreground-muted">
            © 2025 Kelurahan Tiromanda — Admin Panel
          </p>
        </footer>
      </div>
    </div>
  );
}
