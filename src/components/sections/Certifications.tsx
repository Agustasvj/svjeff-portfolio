/* ============================================================
   CERTIFICATIONS SECTION — Verified Engineering Credentials
   Interactive certification gallery with click-to-preview modal
   ============================================================ */

import { useState } from 'react';
import { certificationsData } from '../../config/site';
import type { Certification } from '../../types';
import './Certifications.css';

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <section className="certifications section" id="certifications">
      <div className="container">
        <div className="section-header">
          <span className="section-label mono">VERIFIED ACADEMIC & TECHNICAL CREDENTIALS</span>
          <h2 className="section-title">Certifications & Honors</h2>
        </div>

        <div className="certifications__grid">
          {certificationsData.map((cert) => (
            <div
              key={cert.id}
              className="cert-card"
              onClick={() => setSelectedCert(cert)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedCert(cert);
                }
              }}
            >
              <div className="cert-card__header">
                {cert.badge ? (
                  <div className="cert-card__badge-img-frame">
                    <img src={cert.badge} alt={`${cert.title} badge`} className="cert-card__badge-img" />
                  </div>
                ) : (
                  <div className="cert-card__icon-frame">
                    <span>🏆</span>
                  </div>
                )}
                <div className="cert-card__meta">
                  <span className="cert-card__issuer mono">{cert.issuer}</span>
                  <span className="cert-card__date mono">{cert.date}</span>
                </div>
              </div>

              <h3 className="cert-card__title">{cert.title}</h3>

              {cert.skills && (
                <div className="cert-card__skills">
                  {cert.skills.map((s) => (
                    <span key={s} className="cert-card__skill mono">{s}</span>
                  ))}
                </div>
              )}

              <div className="cert-card__footer">
                <span className="cert-card__verify-status mono">
                  <span className="status-dot" /> Verified Credential
                </span>
                <span className="cert-card__action mono">
                  Inspect
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Lightbox Modal */}
      {selectedCert && (
        <div className="cert-modal-overlay" onClick={() => setSelectedCert(null)}>
          <div className="cert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal__header">
              <div className="cert-modal__header-left">
                <span className="cert-modal__issuer mono">{selectedCert.issuer}</span>
                <h3 className="cert-modal__title">{selectedCert.title}</h3>
              </div>
              <button
                className="cert-modal__close"
                onClick={() => setSelectedCert(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="cert-modal__body">
              {selectedCert.certificate ? (
                <div className="cert-modal__img-frame">
                  <img
                    src={selectedCert.certificate}
                    alt={`${selectedCert.title} Certificate`}
                    className="cert-modal__img"
                  />
                </div>
              ) : (
                <div className="cert-modal__empty mono">Certificate image not available</div>
              )}
            </div>

            <div className="cert-modal__footer">
              <div className="cert-modal__info mono">
                Issued Year: {selectedCert.date} • Verified by {selectedCert.issuer}
              </div>
              {selectedCert.certificate && (
                <a
                  href={selectedCert.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-modal__download mono"
                >
                  Open Full Resolution
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
