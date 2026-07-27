'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { NAV_ITEMS } from '@/lib/constants';
import { FaBars, FaTimes, FaGlobe, FaSun, FaMoon } from 'react-icons/fa';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    // Init from localStorage or system preference
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved ? saved === 'dark' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = NAV_ITEMS.map((item) => item.id);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) { setActiveSection(sections[i]); break; }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#1F3A2C]/97 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-white/10'
            : 'bg-gradient-to-b from-black/40 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[80px]">
            <motion.a
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0">
                <Image src="/logo-tana-toraja.png" alt="Logo Tana Toraja" width={44} height={44} className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105" priority />
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-lg leading-tight block text-white drop-shadow-sm">Tiromanda</span>
                <span className="text-xs leading-tight block text-white/80 font-medium">Kabupaten Tana Toraja</span>
              </div>
            </motion.a>

            <div className="hidden xl:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeSection === item.id ? 'text-accent' : 'text-white/75 hover:text-white'
                  }`}
                >
                  {language === 'id' ? item.label_id : item.label_en}
                  {activeSection === item.id && (
                    <motion.div layoutId="activeNav" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <div className="relative">
                <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-white/75 hover:text-white hover:bg-white/10">
                  <FaGlobe className="text-base" />
                  <span className="hidden sm:inline">{language === 'id' ? 'ID' : 'EN'}</span>
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <button onClick={() => { setLanguage('id'); setIsLangOpen(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${language === 'id' ? 'text-primary font-semibold bg-primary/5' : 'text-foreground-light'}`}>🇮🇩 Indonesian</button>
                      <button onClick={() => { setLanguage('en'); setIsLangOpen(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${language === 'en' ? 'text-primary font-semibold bg-primary/5' : 'text-foreground-light'}`}>🇬🇧 English</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark / Light mode toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark/light mode"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 text-white/75 hover:text-white hover:bg-white/10"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.span
                      key="sun"
                      initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                      transition={{ duration: 0.25 }}
                      className="absolute"
                    >
                      <FaSun className="text-lg text-amber-300" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
                      transition={{ duration: 0.25 }}
                      className="absolute"
                    >
                      <FaMoon className="text-lg text-blue-200" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="xl:hidden p-2.5 rounded-xl transition-all duration-300 text-white hover:bg-white/10">
                {isMobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 xl:hidden" onClick={() => setIsMobileOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-[300px] bg-[#1F3A2C] shadow-2xl z-50 xl:hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <Image src="/logo-tana-toraja.png" alt="Logo Tana Toraja" width={40} height={40} className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-lg text-white block leading-tight">Tiromanda</span>
                    <span className="text-xs text-white/70 block leading-tight font-medium">Kabupaten Tana Toraja</span>
                  </div>
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                  <FaTimes className="text-xl text-white/70" />
                </button>
              </div>

              <div className="space-y-1">
                {NAV_ITEMS.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeSection === item.id ? 'bg-accent/20 text-accent border border-accent/30' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {language === 'id' ? item.label_id : item.label_en}
                    {activeSection === item.id && <div className="ml-auto w-2 h-2 rounded-full bg-accent" />}
                  </motion.a>
                ))}
              </div>

              {/* Dark/light toggle in mobile menu */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-white/80 hover:bg-white/10"
                >
                  {isDark ? <FaSun className="text-amber-300 text-base" /> : <FaMoon className="text-blue-200 text-base" />}
                  {isDark ? 'Mode Siang' : 'Mode Malam'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
