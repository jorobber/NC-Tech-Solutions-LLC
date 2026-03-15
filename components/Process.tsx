import React from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, PenLine, Cog, BarChart3, HeadphonesIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const stepIcons = [ClipboardCheck, PenLine, Cog, BarChart3, HeadphonesIcon];

const Process: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const p = t.process;

  return (
    <section id="process" className="relative py-24 sm:py-32 section-gradient-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-blue-400 tracking-widest uppercase">
            {p.label}
          </span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {p.title}
          </h2>
          <p className={`max-w-2xl mx-auto text-base sm:text-lg ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {p.subtitle}
          </p>
          <div className="gradient-divider max-w-xs mx-auto mt-8" />
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-blue-500/20 to-transparent" />

          <div className="space-y-10">
            {p.steps.map((step, index) => {
              const Icon = stepIcons[index];
              const num = String(index + 1).padStart(2, '0');
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex gap-6 sm:gap-8"
                >
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl border border-blue-500/25 flex items-center justify-center glow-blue ${
                      theme === 'dark' ? 'bg-dark-900' : 'bg-white'
                    }`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="glass-card-light rounded-xl p-5 sm:p-6 flex-1 hover:border-blue-500/20 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-blue-500/60 tracking-wider">{num}</span>
                      <h3 className={`text-lg font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>{step.title}</h3>
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
