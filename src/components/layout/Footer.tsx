/* ============================================================
   FOOTER COMPONENT
   Engineering portfolio footer with system status & coordinates
   ============================================================ */

import { siteConfig } from '../../config/site';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo mono">
              <span className="bracket">[</span> JM <span className="bracket">]</span>
            </span>
            <span className="footer__title">{siteConfig.name}</span>
            <span className="footer__subtitle mono">{siteConfig.title}</span>
          </div>

          <div className="footer__links">
            <div className="footer__nav-group">
              <span className="footer__heading mono">NAVIGATION</span>
              <a href="#hero" className="footer__link">Top</a>
              <a href="#projects" className="footer__link">Projects Dashboard</a>
              <a href="#about" className="footer__link">About Me</a>
              <a href="#skills" className="footer__link">Skills Matrix</a>
              <a href="#certifications" className="footer__link">Certifications</a>
              <a href="#contact" className="footer__link">Contact</a>
            </div>

            <div className="footer__nav-group">
              <span className="footer__heading mono">CHANNELS</span>
              <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="footer__link">
                GitHub ↗
              </a>
              <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer" className="footer__link">
                WhatsApp ↗
              </a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="footer__link">
                Instagram ↗
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__status-strip mono">
            <span className="footer__status-dot" />
            <span>Systems Nominal • Hardware–Firmware Architecture 2.0</span>
          </div>

          <div className="footer__copyright mono">
            © {currentYear} {siteConfig.name}. Designed & Built with Vite, React & Three.js.
          </div>
        </div>
      </div>
    </footer>
  );
}
