import React from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  ShieldCheck,
  Wifi,
  Phone,
  Camera,
  Laptop,
  Truck,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const icons = [Settings, ShieldCheck, Wifi, Phone, Camera, Laptop, Truck];

const Services: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const s = t.services;

  return (
    <section id="services" className="relative py-24 sm:py-32 section-gradient-1">
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
            {s.label}
          </span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {s.title}
          </h2>
          <p className={`max-w-2xl mx-auto text-base sm:text-lg ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {s.subtitle}
          </p>
          <div className="gradient-divider max-w-xs mx-auto mt-8" />
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {s.items.map((service, index) => {
            const Icon = icons[index] || Settings;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="service-card glass-card rounded-2xl p-7 group cursor-default"
              >
                <div className="service-icon w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-blue-600/20">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className={`text-lg font-semibold mb-2.5 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>{service.title}</h3>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
