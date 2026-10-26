/* ============================================================
   ABOUT SECTION — Profile, Philosophy & Academic Background
   ============================================================ */

import { siteConfig, experienceData } from '../../config/site';
import './About.css';

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="section-header">
          <span className="section-label mono">BIOGRAPHY & BACKGROUND</span>
          <h2 className="section-title">About Me</h2>
        </div>

        <div className="about__grid">
          {/* Left Column: Portrait & Key Details */}
          <div className="about__card about__portrait-card">
            <div className="about__avatar-frame">
              <img
                src={siteConfig.avatarUrl}
                alt={siteConfig.name}
                className="about__avatar-img"
              />
              <div className="about__status-indicator">
                <span className="about__pulse-dot" />
                <span className="mono">Open to Opportunities & Collaborations</span>
              </div>
            </div>

            <div className="about__quick-specs">
              <div className="about__spec-row">
                <span className="mono label">Location</span>
                <span className="mono value">{siteConfig.location}</span>
              </div>
              <div className="about__spec-row">
                <span className="mono label">Institution</span>
                <span className="mono value">Moi University</span>
              </div>
              <div className="about__spec-row">
                <span className="mono label">Discipline</span>
                <span className="mono value">B.Sc. Informatics</span>
              </div>
              <div className="about__spec-row">
                <span className="mono label">Focus</span>
                <span className="mono value">IoT & Embedded Systems</span>
              </div>
            </div>

            <div className="about__actions">
              <a
                href={siteConfig.resumeUrl}
                download
                className="btn btn--primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Resume (PDF)
              </a>
            </div>
          </div>

          {/* Right Column: Narrative & Focus Pillars */}
          <div className="about__content">
            <div className="about__card about__narrative-card">
              <h3 className="about__card-title">Hardware–Software Convergence</h3>
              <p className="about__paragraph">
                {siteConfig.introduction}
              </p>
              <p className="about__paragraph">
                {siteConfig.introductionExtended}
              </p>

              {/* Pillars */}
              <div className="about__pillars">
                <div className="about__pillar">
                  <div className="about__pillar-icon">⚡</div>
                  <h4 className="about__pillar-title">Embedded Logic</h4>
                  <p className="about__pillar-desc">
                    Designing low-power firmware in C/C++ on ESP32, Arduino, and NodeMCU microcontrollers with interrupt-driven peripherals.
                  </p>
                </div>

                <div className="about__pillar">
                  <div className="about__pillar-icon">🔌</div>
                  <h4 className="about__pillar-title">Custom Circuitry</h4>
                  <p className="about__pillar-desc">
                    Creating multi-layer PCB schematics and layouts in KiCad with rigorous signal integrity and manufacturing design rules.
                  </p>
                </div>

                <div className="about__pillar">
                  <div className="about__pillar-icon">⚙️</div>
                  <h4 className="about__pillar-title">Mechanical CAD</h4>
                  <p className="about__pillar-desc">
                    Engineering parametric chassis and enclosures in Autodesk Fusion 360, uniting physical packaging with circuit clearances.
                  </p>
                </div>
              </div>
            </div>

            {/* Education & Academic Progress */}
            <div className="about__card about__education-card">
              <h3 className="about__card-title">Education & Milestones</h3>
              <div className="about__timeline">
                {experienceData.map((exp) => (
                  <div key={exp.id} className="about__timeline-item">
                    <div className="about__timeline-marker" />
                    <div className="about__timeline-content">
                      <div className="about__timeline-header">
                        <h4 className="about__timeline-title">{exp.title}</h4>
                        <span className="about__timeline-date mono">{exp.startDate} — Present</span>
                      </div>
                      <p className="about__timeline-org mono">{exp.organization} • {exp.location}</p>
                      <p className="about__timeline-desc">{exp.description}</p>
                      {exp.skills && (
                        <div className="about__timeline-skills">
                          {exp.skills.map((s) => (
                            <span key={s} className="about__skill-tag mono">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
