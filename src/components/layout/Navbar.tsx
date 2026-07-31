'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { NAV_ITEMS, NavItem } from '@/lib/constants';
import { FaBars, FaTimes, FaSun, FaMoon, FaChevronDown } from 'react-icons/fa';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isDark, setIsDark] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved ? saved === 'dark' : prefersDark;
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      // Collect all section IDs (including children)
      const sectionIds: string[] = [];
      NAV_ITEMS.forEach((item) => {
        sectionIds.push(item.id);
        item.children?.forEach((child) => sectionIds.push(child.id));
      });
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) { setActiveSection(sectionIds[i]); break; }
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNavClick = () => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
  };

  // Determine if a nav item or any of its children is "active"
  const isItemActive = (item: NavItem) => {
    if (activeSection === item.id) return true;
    return item.children?.some((c) => c.id === activeSection) ?? false;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-[#1F3A2C]/97 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-white/10'
          : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[88px]">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={handleNavClick}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0">
                <Image src="/logo-custom.png" alt="Logo Tana Toraja" width={44} height={44} className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105" priority />
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-lg leading-tight block text-white drop-shadow-sm">{t('general.village_name')}</span>
                <span className="text-xs leading-tight block text-white/80 font-medium">{t('general.regency')}</span>
              </div>
            </motion.a>

            {/* Desktop Nav */}
            <div ref={dropdownRef} className="hidden xl:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.id} className="relative">
                  {item.children ? (
                    // ── Dropdown trigger ──
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                      onMouseEnter={() => setOpenDropdown(item.id)}
                      className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        isItemActive(item) ? 'text-accent' : 'text-white/75 hover:text-white'
                      }`}
                    >
                      {language === 'id' ? item.label_id : item.label_en}
                      <FaChevronDown
                        className={`text-[10px] transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180' : ''}`}
                      />
                      {isItemActive(item) && (
                        <motion.div layoutId="activeNav" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                      )}
                    </button>
                  ) : (
                    // ── Regular link ──
                    <a
                      href={item.href}
                      onClick={handleNavClick}
                      className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 block ${
                        isItemActive(item) ? 'text-accent' : 'text-white/75 hover:text-white'
                      }`}
                    >
                      {language === 'id' ? item.label_id : item.label_en}
                      {isItemActive(item) && (
                        <motion.div layoutId="activeNav" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                      )}
                    </a>
                  )}

                  {/* Dropdown panel */}
                  {item.children && (
                    <AnimatePresence>
                      {openDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.18 }}
                          onMouseLeave={() => setOpenDropdown(null)}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[170px] rounded-xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl z-50"
                          style={{ background: 'rgba(20,42,30,0.96)' }}
                        >
                          {item.children.map((child, i) => (
                            <button
                              key={child.id}
                              onClick={handleNavClick}
                              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                                activeSection === child.id
                                  ? 'text-accent bg-accent/10'
                                  : 'text-white/75 hover:text-white hover:bg-white/8'
                              } ${i !== 0 ? 'border-t border-white/5' : ''}`}
                            >
                              {activeSection === child.id && (
                                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                              )}
                              {language === 'id' ? child.label_id : child.label_en}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Language switcher pill */}
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20 shadow-sm mr-2">
                <button 
                  onClick={() => setLanguage('id')} 
                  className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${language === 'id' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                >
                  ID
                </button>
                <button 
                  onClick={() => setLanguage('en')} 
                  className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${language === 'en' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                >
                  EN
                </button>
              </div>

              {/* Dark / Light mode toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark/light mode"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 text-white/75 hover:text-white hover:bg-white/10"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.span key="sun" initial={{ opacity: 0, rotate: -90, scale: 0.6 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.6 }} transition={{ duration: 0.25 }} className="absolute">
                      <FaSun className="text-lg text-amber-300" />
                    </motion.span>
                  ) : (
                    <motion.span key="moon" initial={{ opacity: 0, rotate: 90, scale: 0.6 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: -90, scale: 0.6 }} transition={{ duration: 0.25 }} className="absolute">
                      <FaMoon className="text-lg text-blue-200" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <a
                href="#footer"
                onClick={handleNavClick}
                className="hidden xl:flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-xl text-sm font-semibold transition-all shadow-md"
              >
                {language === 'id' ? 'Tentang Kami' : 'About Us'}
              </a>

              <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="xl:hidden p-2.5 rounded-xl transition-all duration-300 text-white hover:bg-white/10">
                {isMobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 xl:hidden" onClick={() => setIsMobileOpen(false)} />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-[300px] bg-[#1F3A2C] shadow-2xl z-50 xl:hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <Image src="/logo-custom.png" alt="Logo Tana Toraja" width={40} height={40} className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-lg text-white block leading-tight">{t('general.village_name')}</span>
                    <span className="text-xs text-white/70 block leading-tight font-medium">{t('general.regency')}</span>
                  </div>
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                  <FaTimes className="text-xl text-white/70" />
                </button>
              </div>

              <div className="space-y-1">
                {NAV_ITEMS.map((item, index) => (
                  <div key={item.id}>
                    {item.children ? (
                      // Accordion for items with children
                      <div>
                        <button
                          onClick={() => setMobileExpanded(mobileExpanded === item.id ? null : item.id)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isItemActive(item) ? 'bg-accent/20 text-accent border border-accent/30' : 'text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span>{language === 'id' ? item.label_id : item.label_en}</span>
                          <FaChevronDown className={`text-[10px] transition-transform duration-200 ${mobileExpanded === item.id ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === item.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                                {item.children.map((child) => (
                                  <button
                                    key={child.id}
                                    onClick={() => handleNavClick(child.href)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                                      activeSection === child.id ? 'text-accent font-semibold' : 'text-white/60 hover:text-white'
                                    }`}
                                  >
                                    {language === 'id' ? child.label_id : child.label_en}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <motion.a
                        href={item.href}
                        onClick={handleNavClick}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isItemActive(item) ? 'bg-accent/20 text-accent border border-accent/30' : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {language === 'id' ? item.label_id : item.label_en}
                        {isItemActive(item) && <div className="ml-auto w-2 h-2 rounded-full bg-accent" />}
                      </motion.a>
                    )}
                  </div>
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
