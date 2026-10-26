/* ============================================================
   HERO SECTION — Main landing view
   ============================================================ */

import { motion } from 'framer-motion';
import { siteConfig } from '../../config/site';
import './Hero.css';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="hero" id="home">
      {/* Ambient decoration */}
      <div className="hero__ambient" />
      <div className="hero__grid-overlay" />

      <div className="hero__content container">
        <div className="hero__left">
          <motion.div
            className="hero__status"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="hero__status-dot" />
            <span className="hero__status-text">Available for collaboration</span>
          </motion.div>

          <motion.p
            className="hero__label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {siteConfig.shortTitle}
          </motion.p>

          <motion.h1
            className="hero__name"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {siteConfig.name}
          </motion.h1>

          <motion.p
            className="hero__intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {siteConfig.introduction}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <button className="hero__btn hero__btn--primary" onClick={() => onNavigate('projects')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              Explore Projects
            </button>
            <button className="hero__btn hero__btn--secondary" onClick={() => onNavigate('contact')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              Get in Touch
            </button>
          </motion.div>

          <motion.div
            className="hero__metrics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            <div className="hero__metric">
              <span className="hero__metric-value">5+</span>
              <span className="hero__metric-label">Projects</span>
            </div>
            <div className="hero__metric-divider" />
            <div className="hero__metric">
              <span className="hero__metric-value">4</span>
              <span className="hero__metric-label">Certifications</span>
            </div>
            <div className="hero__metric-divider" />
            <div className="hero__metric">
              <span className="hero__metric-value">3+</span>
              <span className="hero__metric-label">Disciplines</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero__right"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="hero__card">
            <div className="hero__card-header">
              <span className="hero__card-dot hero__card-dot--red" />
              <span className="hero__card-dot hero__card-dot--yellow" />
              <span className="hero__card-dot hero__card-dot--green" />
              <span className="hero__card-title mono">profile.json</span>
            </div>
            <div className="hero__card-body">
              <pre className="hero__code"><code>{`{
  "name": "${siteConfig.name}",
  "role": "${siteConfig.title}",
  "university": "Moi University",
  "focus": [
    "IoT Systems",
    "Embedded Electronics",
    "PCB Design",
    "Mechanical CAD"
  ],
  "tools": [
    "ESP32", "KiCad",
    "Fusion 360", "Python"
  ],
  "status": "building_the_future"
}`}</code></pre>
            </div>
          </div>

          {/* Floating tech badges */}
          <div className="hero__floating-badges">
            <span className="hero__badge hero__badge--1">ESP32</span>
            <span className="hero__badge hero__badge--2">KiCad</span>
            <span className="hero__badge hero__badge--3">Fusion 360</span>
            <span className="hero__badge hero__badge--4">IoT</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="hero__scroll-text mono">scroll</span>
        <div className="hero__scroll-line" />
      </motion.div>
    </section>
  );
}
