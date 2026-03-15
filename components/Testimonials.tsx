import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Testimonials: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const tm = t.testimonials;

  return (
    <section className="relative py-24 sm:py-32 section-gradient-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-blue-400 tracking-widest uppercase">
            {tm.label}
          </span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {tm.title}
          </h2>
          <div className="gradient-divider max-w-xs mx-auto mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tm.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-7 flex flex-col"
            >
              <Quote className="w-8 h-8 text-blue-500/30 mb-4" />
              <p className={`text-sm leading-relaxed flex-1 mb-6 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>
                "{item.quote}"
              </p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <div>
                <p className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>{item.name}</p>
                <p className="text-xs text-slate-500">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
