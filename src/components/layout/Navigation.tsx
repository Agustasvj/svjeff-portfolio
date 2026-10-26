/* ============================================================
   NAVIGATION COMPONENT
   Floating top navigation with engineering aesthetic
   ============================================================ */

import { useState, useEffect } from 'react';
import { siteConfig } from '../../config/site';
import './Navigation.css';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'telemetry', label: 'Project Track' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

export default function Navigation({ activeSection, onNavigate }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="nav__inner">
        <a href="#home" className="nav__logo" onClick={(e) => { e.preventDefault(); handleNav('home'); }}>
          <span className="nav__logo-bracket">[</span>
          <span className="nav__logo-text">{siteConfig.name.split(' ')[0]}</span>
          <span className="nav__logo-bracket">]</span>
        </a>

        <button
          className={`nav__mobile-toggle ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`nav__list ${mobileOpen ? 'nav__list--open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.id} className="nav__item">
              <button
                className={`nav__link ${activeSection === item.id ? 'nav__link--active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
