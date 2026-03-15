import React from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  Stethoscope,
  GraduationCap,
  Landmark,
  ShoppingCart,
  Factory,
  Truck,
  Scale,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const industryIcons = [Building2, Stethoscope, GraduationCap, Landmark, ShoppingCart, Factory, Truck, Scale];

const Industries: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const ind = t.industries;

  return (
    <section className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-blue-400 tracking-widest uppercase">
            {ind.label}
          </span>
          <h2 className={`text-2xl sm:text-3xl font-bold mt-3 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {ind.title}
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {ind.items.map((name, index) => {
            const Icon = industryIcons[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full border transition-all duration-300 cursor-default ${
                  theme === 'dark'
                    ? 'border-slate-700/50 bg-slate-800/30 hover:border-blue-500/30 hover:bg-slate-800/50'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-400" />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>{name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Industries;
