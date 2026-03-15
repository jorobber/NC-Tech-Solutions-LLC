import React from 'react';
import { motion } from 'motion/react';
import {
  Server,
  Shield,
  Monitor,
  Users,
  Layers,
  Network,
  Lock,
  Wifi,
  Cable,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const technologies = [
  { name: 'Cisco', icon: Network, category: 'Networking' },
  { name: 'Fortinet', icon: Shield, category: 'Security' },
  { name: 'Windows Server', icon: Monitor, category: 'Server' },
  { name: 'Active Directory', icon: Users, category: 'Identity' },
  { name: 'VMware vSphere', icon: Layers, category: 'Virtualization' },
  { name: 'VLANs', icon: Server, category: 'Networking' },
  { name: 'VPN Solutions', icon: Lock, category: 'Security' },
  { name: 'Wireless Infrastructure', icon: Wifi, category: 'Wireless' },
  { name: 'Structured Cabling', icon: Cable, category: 'Physical' },
];

const Technologies: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const tc = t.technologies;

  return (
    <section id="technologies" className="relative py-24 sm:py-32 section-gradient-1">
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
            {tc.label}
          </span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {tc.title}
          </h2>
          <p className={`max-w-2xl mx-auto text-base sm:text-lg ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {tc.subtitle}
          </p>
          <div className="gradient-divider max-w-xs mx-auto mt-8" />
        </motion.div>

        {/* Technology badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="tech-badge rounded-xl p-5 flex flex-col items-center text-center cursor-default"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-600/10 border border-blue-500/15 flex items-center justify-center mb-3">
                <tech.icon className="w-6 h-6 text-blue-400" />
              </div>
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>{tech.name}</span>
              <span className="text-[11px] text-slate-500 mt-0.5">{tech.category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technologies;
