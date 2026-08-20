import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const AboutUs: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const isLight = theme === 'light';
  
  return (
    <section id="about-us" className={`py-20 ${isLight ? 'bg-slate-50' : 'bg-dark-900'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`max-w-3xl mx-auto text-center p-8 md:p-12 rounded-2xl ${isLight ? 'bg-white shadow-xl shadow-slate-200/50' : 'glass-card'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t.aboutUsSection.title}
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
          <p className={`text-lg md:text-xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {t.aboutUsSection.content}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
