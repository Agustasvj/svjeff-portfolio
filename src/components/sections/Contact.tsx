/* ============================================================
   CONTACT SECTION — Direct Channels & Engineering Coordinates
   Features direct WhatsApp CTA, email and phone copy actions,
   and developer coordinates.
   ============================================================ */

import { useState } from 'react';
import { siteConfig } from '../../config/site';
import './Contact.css';

export default function Contact() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-label mono">COMMUNICATION & COORDINATES</span>
          <h2 className="section-title">Let’s Build Together</h2>
        </div>

        <div className="contact__grid">
          {/* Card 1: Direct Engineering Channels */}
          <div className="contact__card">
            <div className="contact__card-header">
              <span className="contact__card-badge mono">DIRECT COMMS</span>
              <h3 className="contact__card-title">Engineering Channels</h3>
            </div>
            <p className="contact__desc">
              Whether you have an embedded systems prototype to build, custom PCB to design,
              mechanical CAD requirements, or a collaborative venture, reach out directly.
            </p>

            <div className="contact__items">
              {/* Email Item */}
              <div className="contact__item">
                <div className="contact__item-icon">✉️</div>
                <div className="contact__item-content">
                  <span className="mono label">Electronic Mail</span>
                  <a href={`mailto:${siteConfig.email}`} className="mono value">
                    {siteConfig.email}
                  </a>
                </div>
                <button
                  className="contact__copy-btn mono"
                  onClick={() => handleCopy(siteConfig.email, 'email')}
                  title="Copy Email"
                >
                  {copiedField === 'email' ? 'Copied! ✓' : 'Copy'}
                </button>
              </div>

              {/* Phone / Mobile */}
              <div className="contact__item">
                <div className="contact__item-icon">📞</div>
                <div className="contact__item-content">
                  <span className="mono label">Phone / Direct Line</span>
                  <a href={`tel:${siteConfig.phone}`} className="mono value">
                    {siteConfig.phone}
                  </a>
                </div>
                <button
                  className="contact__copy-btn mono"
                  onClick={() => handleCopy(siteConfig.phone, 'phone')}
                  title="Copy Phone"
                >
                  {copiedField === 'phone' ? 'Copied! ✓' : 'Copy'}
                </button>
              </div>

              {/* Location */}
              <div className="contact__item">
                <div className="contact__item-icon">📍</div>
                <div className="contact__item-content">
                  <span className="mono label">Station Coordinates</span>
                  <span className="mono value">{siteConfig.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Instant Messaging & Profiles */}
          <div className="contact__card">
            <div className="contact__card-header">
              <span className="contact__card-badge mono">INSTANT CONNECT</span>
              <h3 className="contact__card-title">Direct Dispatch</h3>
            </div>
            <p className="contact__desc">
              Prefer real-time technical discussions? Launch an instant message on WhatsApp
              or explore repository code on GitHub.
            </p>

            <div className="contact__fast-actions">
              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                Message on WhatsApp
              </a>

              <a
                href={`mailto:${siteConfig.email}?subject=${encodeURIComponent('[Engineering Collaboration] Inquiry')}`}
                className="btn btn--secondary mono"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Launch Mail Client ↗
              </a>

              <div className="contact__social-strip">
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__social-link mono"
                >
                  GitHub ↗
                </a>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__social-link mono"
                >
                  Instagram ↗
                </a>
              </div>
            </div>

            <div className="contact__availability-badge mono">
              <span className="status-led success" />
              <span>Available for IoT Prototyping & CAD Design</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
