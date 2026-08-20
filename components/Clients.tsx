import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Clients: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section id="clients" className={`py-24 ${isLight ? 'bg-white' : 'bg-dark-950'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-blue-500 font-semibold tracking-wide uppercase text-sm mb-3">
              {t.clientsSection.subtitle}
            </h2>
            <h3 className={`text-3xl md:text-4xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t.clientsSection.title}
            </h3>
            <div className="w-16 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.clientsSection.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col h-full ${
                isLight ? 'bg-slate-50 border border-slate-200' : 'glass-card'
              }`}
            >
              <div className="h-48 overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6 flex-grow">
                <h4 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {item.title}
                </h4>
                <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'} leading-relaxed`}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
