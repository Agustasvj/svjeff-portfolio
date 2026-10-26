/* ============================================================
   ENGINEERING PORTFOLIO 2.0 — ROOT APPLICATION
   Jeffrey Murithi (@Agustasvj) — IoT & Embedded Systems Engineer
   ============================================================ */

import { useState, useEffect } from 'react';
import Navigation from './components/layout/Navigation';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import GitHubDashboard from './components/sections/GitHubDashboard';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Certifications from './components/sections/Certifications';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import './App.css';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');

  // Handle URL hash navigation & deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash.startsWith('project-')) {
          // Deep link into project
          setActiveSection('projects');
          const element = document.getElementById('projects');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          setActiveSection(hash);
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update active section based on scroll position
  useEffect(() => {
    const sections = ['home', 'projects', 'telemetry', 'about', 'skills', 'certifications', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    window.location.hash = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      {/* Background Grid Pattern */}
      <div className="grid-bg" aria-hidden="true" />

      {/* Top Floating Engineering Navigation */}
      <Navigation activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content Sections */}
      <main>
        <Hero onNavigate={handleNavigate} />
        <Projects />
        <GitHubDashboard />
        <About />
        <Skills />
        <Certifications />
        <Contact />
      </main>

      {/* System Status Footer */}
      <Footer />
    </div>
  );
}
