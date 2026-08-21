import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Clients from './components/Clients';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Technologies from './components/Technologies';
import Process from './components/Process';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Hero />
            <AboutUs />
            <Clients />
            <Services />
            {/* <WhyChooseUs /> */}
            <Process />
            <Gallery />
            <Testimonials />
            <CTA />
            <Technologies />
            <Contact />
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
