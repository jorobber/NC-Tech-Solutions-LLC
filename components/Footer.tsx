import React from 'react';
import { Linkedin, Twitter, Facebook, Mail } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const f = t.footer;

  const companyLinks = [
    { label: t.nav.services, href: '#services' },
    { label: t.nav.whyUs, href: '#why-us' },
    { label: t.nav.technologies, href: '#technologies' },
    { label: t.nav.process, href: '#process' },
    { label: t.nav.portfolio, href: '#portfolio' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const headColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const linkColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const borderColor = theme === 'dark' ? 'border-slate-800/60' : 'border-slate-200';

  return (
    <footer className={`relative border-t ${borderColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Logo size="md" theme={theme} />
            </div>
            <p className={`text-sm leading-relaxed mb-5 max-w-xs ${linkColor}`}>{f.description}</p>
            <div className="flex items-center gap-3">
              {[Linkedin, Twitter, Facebook, Mail].map((Icon, i) => (
                <a key={i} href="#" className={`w-8 h-8 rounded-lg border flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-200 ${
                  theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'
                }`} aria-label="Social link">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-xs font-semibold tracking-wider uppercase mb-4 ${headColor}`}>{f.servicesTitle}</h4>
            <ul className="space-y-2.5">
              {f.serviceLinks.map((s) => (
                <li key={s}>
                  <a href="#services" onClick={(e) => handleNavClick(e, '#services')}
                    className={`text-sm ${linkColor} hover:text-blue-400 transition-colors duration-200`}>{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`text-xs font-semibold tracking-wider uppercase mb-4 ${headColor}`}>{f.companyTitle}</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-sm ${linkColor} hover:text-blue-400 transition-colors duration-200`}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`text-xs font-semibold tracking-wider uppercase mb-4 ${headColor}`}>{f.contactTitle}</h4>
            <ul className={`space-y-2.5 text-sm ${linkColor}`}>
              <li><a href="mailto:info@nctechsolutionsllc.com" className="hover:text-blue-400 transition-colors">info@nctechsolutionsllc.com</a></li>
              <li><a href="tel:+13468148087" className="hover:text-blue-400 transition-colors">+1 (346) 814-8087</a></li>
              <li>{t.contact.info.hours}</li>
              <li>{t.contact.info.emergency}</li>
            </ul>
          </div>
        </div>

        <div className={`border-t ${borderColor} mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} {f.copyright}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{f.privacy}</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{f.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
