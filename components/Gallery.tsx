import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    alt: 'Data center server room',
  },
  {
    src: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    alt: 'Structured cabling installation',
  },
  {
    src: 'https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=600&q=80',
    alt: 'Network switch configuration',
  },
  {
    src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
    alt: 'Dental clinic technology setup',
  },
  {
    src: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    alt: 'Security camera system',
  },
  {
    src: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=600&q=80',
    alt: 'Enterprise wireless deployment',
  },
];

const Gallery: React.FC = () => {
  const { t } = useLanguage();
  const p = t.portfolio;

  return (
    <section id="portfolio" className="relative py-24 sm:py-32 section-gradient-1">
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 light-heading">
            {p.title}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            {p.subtitle}
          </p>
          <div className="gradient-divider max-w-xs mx-auto mt-8" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {p.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative rounded-2xl overflow-hidden cursor-default aspect-[4/3]"
            >
              <img
                src={images[index]?.src}
                alt={images[index]?.alt || item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 portfolio-overlay opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/20 mb-2">
                  {item.category}
                </span>
                <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

export default Gallery;
