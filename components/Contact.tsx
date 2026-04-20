import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Clock, MapPin, Send, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const c = t.contact;

  const [formData, setFormData] = useState({
    name: '', email: '', company: '', phone: '', service: '', message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(c.successMessage);
    setFormData({ name: '', email: '', company: '', phone: '', service: '', message: '' });
  };

  const headingColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <section id="contact" className="relative py-24 sm:py-32 section-gradient-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-blue-400 tracking-widest uppercase">{c.label}</span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 ${headingColor}`}>{c.title}</h2>
          <p className={`max-w-2xl mx-auto text-base sm:text-lg ${subColor}`}>{c.subtitle}</p>
          <div className="gradient-divider max-w-xs mx-auto mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-7 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className={`block text-xs font-medium mb-1.5 ${subColor}`}>{c.form.name} *</label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                    className={`form-input w-full rounded-lg px-4 py-3 text-sm placeholder-slate-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                    placeholder="John Smith" />
                </div>
                <div>
                  <label htmlFor="email" className={`block text-xs font-medium mb-1.5 ${subColor}`}>{c.form.email} *</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                    className={`form-input w-full rounded-lg px-4 py-3 text-sm placeholder-slate-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                    placeholder="john@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="company" className={`block text-xs font-medium mb-1.5 ${subColor}`}>{c.form.company}</label>
                  <input type="text" id="company" name="company" value={formData.company} onChange={handleChange}
                    className={`form-input w-full rounded-lg px-4 py-3 text-sm placeholder-slate-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                    placeholder="Company Name" />
                </div>
                <div>
                  <label htmlFor="phone" className={`block text-xs font-medium mb-1.5 ${subColor}`}>{c.form.phone}</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                    className={`form-input w-full rounded-lg px-4 py-3 text-sm placeholder-slate-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                    placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div>
                <label htmlFor="service" className={`block text-xs font-medium mb-1.5 ${subColor}`}>{c.form.service}</label>
                <select id="service" name="service" value={formData.service} onChange={handleChange}
                  className={`form-input w-full rounded-lg px-4 py-3 text-sm appearance-none cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <option value="" className="bg-slate-900 text-white">{c.form.serviceDefault}</option>
                  {c.form.serviceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className={`block text-xs font-medium mb-1.5 ${subColor}`}>{c.form.message} *</label>
                <textarea id="message" name="message" required rows={4} value={formData.message} onChange={handleChange}
                  className={`form-input w-full rounded-lg px-4 py-3 text-sm placeholder-slate-500 resize-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                  placeholder={c.form.messagePlaceholder} />
              </div>
              <button type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-white font-semibold text-sm">
                <Send className="w-4 h-4" /> {c.form.submit}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="glass-card rounded-2xl p-6 space-y-5">
              {[
                { icon: Mail, label: c.info.emailLabel, content: <a href="mailto:info@nctechsolutionsllc.com" className={`text-sm hover:text-blue-400 transition-colors ${headingColor}`}>info@nctechsolutionsllc.com</a> },
                { icon: Phone, label: c.info.phoneLabel, content: <a href="tel:+13468148087" className={`text-sm hover:text-blue-400 transition-colors ${headingColor}`}>+1 (346) 814-8087</a> },
                { icon: Clock, label: c.info.hoursLabel, content: <><p className={`text-sm ${headingColor}`}>{c.info.hours}</p><p className={`text-sm ${subColor}`}>{c.info.emergency}</p></> },
                { icon: MapPin, label: c.info.locationLabel, content: <p className={`text-sm ${headingColor}`}>{c.info.location}</p> },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/15 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-0.5">{item.label}</p>
                    {item.content}
                  </div>
                </div>
              ))}
            </div>

            <a href="https://wa.me/13468148087" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 glass-card rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-green-600/15 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600/25 transition-colors duration-300">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${headingColor}`}>{c.info.whatsapp}</p>
                <p className={`text-xs ${subColor}`}>{c.info.whatsappSub}</p>
              </div>
            </a>

            <div className="glass-card rounded-2xl overflow-hidden h-48">
              <div className={`w-full h-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'
              }`}>
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-blue-400/40 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">{c.info.mapLabel}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
