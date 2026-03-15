import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Headphones,
  TrendingUp,
  Lock,
  Zap,
  Building2,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const reasonIcons = [CheckCircle2, Headphones, TrendingUp, Lock, Zap, Building2];

const statValues = [
  { value: 150, suffix: '+' },
  { value: 99.9, suffix: '%' },
  { value: 24, suffix: '/7' },
  { value: 50, suffix: '+' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(interval); }
      else setCount(Math.floor(current * 10) / 10);
    }, 2000 / steps);
    return () => clearInterval(interval);
  }, [started, value]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl font-bold">
      <span>{Number.isInteger(value) ? Math.floor(count) : count.toFixed(1)}</span>
      <span className="text-blue-400">{suffix}</span>
    </div>
  );
}

const WhyChooseUs: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const w = t.whyUs;

  return (
    <section id="why-us" className="relative py-24 sm:py-32 section-gradient-2">
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
            {w.label}
          </span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {w.title}
          </h2>
          <p className={`max-w-2xl mx-auto text-base sm:text-lg ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {w.subtitle}
          </p>
          <div className="gradient-divider max-w-xs mx-auto mt-8" />
        </motion.div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {w.reasons.map((reason, index) => {
            const Icon = reasonIcons[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="glass-card-light rounded-2xl p-6 group hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className={`text-base font-semibold mb-1.5 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>{reason.title}</h3>
                    <p className={`text-sm leading-relaxed ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>{reason.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-2xl p-8 sm:p-10"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {w.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
                  <AnimatedCounter value={statValues[i].value} suffix={statValues[i].suffix} />
                </div>
                <p className={`text-sm mt-1.5 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
