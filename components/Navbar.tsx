import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, t, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { label: t.nav.aboutUs, href: '#about-us' },
    { label: t.nav.clients, href: '#clients' },
    { label: t.nav.services, href: '#services' },
    // { label: t.nav.whyUs, href: '#why-us' },
    { label: t.nav.process, href: '#process' },
    { label: t.nav.portfolio, href: '#portfolio' },
    { label: t.nav.technologies, href: '#technologies' },
    { label: t.nav.contact, href: '#contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isLight = theme === 'light';
  const textColor = isLight ? 'text-slate-600' : 'text-slate-300';
  const textHover = isLight ? 'hover:text-slate-900' : 'hover:text-white';
  const logoText = isLight ? 'text-slate-900' : 'text-white';
  const toggleBorder = isLight ? 'border-slate-300' : 'border-slate-600/30';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'navbar-solid py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="group">
            <Logo size="lg" theme={theme} className="scale-[1.3] md:scale-150 origin-left -translate-y-1" />
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm font-medium ${textColor} ${textHover} transition-colors duration-200 relative group`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${toggleBorder} text-xs font-semibold ${textColor} ${textHover} transition-all duration-200 hover:border-blue-500/30`}
              aria-label="Toggle language"
            >
              <Languages className="w-3.5 h-3.5" />
              {language === 'en' ? 'ES' : 'EN'}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border ${toggleBorder} ${textColor} ${textHover} transition-all duration-200 hover:border-blue-500/30`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-lg text-white"
            >
              {t.nav.getQuote}
            </a>
          </div>

          {/* Mobile right side */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${textColor} border ${toggleBorder}`}
              aria-label="Toggle language"
            >
              {language === 'en' ? 'ES' : 'EN'}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${textColor} border ${toggleBorder}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 ${textColor} ${textHover} transition-colors`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden"
          >
            <div className="px-4 py-6 mt-2 mx-4 rounded-xl glass-card space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 px-4">
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="btn-primary block text-center text-sm font-semibold px-5 py-3 rounded-lg text-white"
                >
                  {t.nav.getQuote}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
