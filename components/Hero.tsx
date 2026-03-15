import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, PhoneCall } from 'lucide-react';
import NetworkBackground from './NetworkBackground';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const h = t.hero;

  const handleClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {theme === 'dark' ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 via-transparent to-blue-950/20" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-blue-50/50" />
        </>
      )}
      <NetworkBackground />
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-3xl ${
        theme === 'dark' ? 'bg-blue-600/5' : 'bg-blue-400/8'
      }`} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 ${
              theme === 'dark' ? 'border-blue-500/20 bg-blue-500/5' : 'border-blue-300/40 bg-blue-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className={`text-xs font-medium tracking-wide uppercase ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
            }`}>{h.badge}</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{h.headline1}</span>
            <br />
            <span className="gradient-text">{h.headline2}</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >{h.subheadline}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#contact" onClick={handleClick('#contact')}
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-white font-semibold text-sm sm:text-base">
              {h.cta1} <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#contact" onClick={handleClick('#contact')}
              className={`btn-outline inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-sm sm:text-base ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
              }`}>
              <PhoneCall className="w-4 h-4" /> {h.cta2}
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-5 h-8 rounded-full border flex items-start justify-center p-1.5 ${
              theme === 'dark' ? 'border-slate-600' : 'border-slate-400'
            }`}
          >
            <div className="w-1 h-1.5 rounded-full bg-blue-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
