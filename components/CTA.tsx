import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const CTA: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const c = t.cta;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className={`absolute inset-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-blue-950/50 via-blue-900/30 to-blue-950/50'
          : 'bg-gradient-to-r from-blue-50 via-blue-100/50 to-blue-50'
      }`} />
      <div className="absolute inset-0 grid-pattern" />
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${
        theme === 'dark' ? 'bg-blue-600/8' : 'bg-blue-300/10'
      }`} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/20 mb-6">
            <Shield className="w-7 h-7 text-blue-400" />
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {c.title1}
            <br />
            <span className="gradient-text">{c.title2}</span>
          </h2>

          <p className={`text-base sm:text-lg max-w-2xl mx-auto mb-10 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>{c.subtitle}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#contact" onClick={handleClick}
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-lg text-white font-semibold text-base">
              {c.btn1} <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#contact" onClick={handleClick}
              className={`btn-outline inline-flex items-center gap-2 px-10 py-4 rounded-lg font-semibold text-base ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
              }`}>
              {c.btn2}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
