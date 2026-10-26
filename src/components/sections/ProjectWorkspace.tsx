/* ============================================================
   PROJECT WORKSPACE — Expandable Detail View & Interactive Studio
   Embeds 3D CAD viewer, Architecture diagrams, Git history,
   interactive stage timeline, and image gallery lightbox.
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StaticProject } from '../../types';
import { stageConfig, categoryConfig } from '../../config/site';
import ThreeDViewer from '../viewers/ThreeDViewer';
import ArchitectureDiagram from '../diagrams/ArchitectureDiagram';
import GitHistoryDiagram from '../diagrams/GitHistoryDiagram';
import WebPreview from '../viewers/WebPreview';
import ImageViewer from '../viewers/ImageViewer';
import './ProjectWorkspace.css';

interface ProjectWorkspaceProps {
  project: StaticProject;
  onClose: () => void;
}

export default function ProjectWorkspace({ project, onClose }: ProjectWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'interactive' | 'gallery' | 'specs'>('overview');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeLightboxIndex !== null) {
          setActiveLightboxIndex(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose, activeLightboxIndex]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const stage = stageConfig[project.stage];
  const category = categoryConfig[project.category];

  // Determine interactive viewer capabilities
  const isPCBProject = project.category === 'pcb';
  const hasCADModel = Boolean(project.modelUrl) || ['sxs-spaceframe', 'mtb-frame', 'handheld-controller'].includes(project.id);
  const hasArchDiagram = ['vforce-txrx', 'afyalink', 'sim-wheel'].includes(project.id);

  return (
    <motion.div
      className="workspace-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="workspace"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label={`Project workspace: ${project.title}`}
      >
        {/* Header */}
        <div className="workspace__header">
          <div className="workspace__header-left">
            <div className="workspace__badges">
              <span className="workspace__badge" style={{ '--badge-color': stage?.color } as React.CSSProperties}>
                {stage?.label || project.stage}
              </span>
              <span className="workspace__badge workspace__badge--cat">
                {category?.icon} {category?.label}
              </span>
              <span className="workspace__badge mono" style={{ color: 'var(--color-accent-green)' }}>
                ID: {project.id}
              </span>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="workspace__badge mono"
                  style={{
                    color: 'var(--color-accent-blue)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="View repository on GitHub"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub ↗
                </a>
              )}
            </div>
            <h2 className="workspace__title">{project.title}</h2>
            <p className="workspace__subtitle">{project.description}</p>
          </div>
          <button className="workspace__close" onClick={onClose} aria-label="Close workspace">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="workspace__tabs">
          <button
            className={`workspace__tab ${activeTab === 'overview' ? 'workspace__tab--active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Lifecycle
          </button>
          <button
            className={`workspace__tab ${activeTab === 'interactive' ? 'workspace__tab--active' : ''}`}
            onClick={() => setActiveTab('interactive')}
          >
            {isPCBProject ? '3D PCB & Circuitry' : hasCADModel ? '3D CAD Model' : hasArchDiagram ? 'System Architecture' : 'Interactive Studio'}
          </button>
          <button
            className={`workspace__tab ${activeTab === 'gallery' ? 'workspace__tab--active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Visual Gallery ({project.images?.length || 0})
          </button>
          <button
            className={`workspace__tab ${activeTab === 'specs' ? 'workspace__tab--active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Technical Specs
          </button>
        </div>

        {/* Content Body */}
        <div className="workspace__content">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="workspace__overview">
              <div className="workspace__section">
                <h3 className="workspace__section-title">Project Objective</h3>
                <p>{project.objective}</p>
              </div>

              {/* Stage Timeline */}
              <div className="workspace__section">
                <h3 className="workspace__section-title">Engineering Development Lifecycle</h3>
                <div className="workspace__stage-timeline">
                  {Object.entries(stageConfig)
                    .filter(([key]) => !['on-hold', 'archived', 'blocked', 'unknown'].includes(key))
                    .sort(([, a], [, b]) => a.order - b.order)
                    .map(([key, config]) => {
                      const currentOrder = stage?.order ?? 10;
                      const isComplete = config.order < currentOrder;
                      const isCurrent = key === project.stage;
                      return (
                        <div
                          key={key}
                          className={`workspace__stage-step ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''}`}
                        >
                          <div
                            className="workspace__stage-dot"
                            style={{ '--dot-color': config.color } as React.CSSProperties}
                          />
                          <span className="workspace__stage-label mono">{config.label}</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {project.features && project.features.length > 0 && (
                <div className="workspace__section">
                  <h3 className="workspace__section-title">Key Architectural Features</h3>
                  <ul className="workspace__list">
                    {project.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.currentProgress && project.currentProgress.length > 0 && (
                <div className="workspace__section">
                  <h3 className="workspace__section-title">Current Progress & Validation</h3>
                  <ul className="workspace__list">
                    {project.currentProgress.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.designFocus && project.designFocus.length > 0 && (
                <div className="workspace__section">
                  <h3 className="workspace__section-title">Design Focus & Methodology</h3>
                  <ul className="workspace__list">
                    {project.designFocus.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.outcome && (
                <div className="workspace__section">
                  <h3 className="workspace__section-title">Project Outcome</h3>
                  <p>{project.outcome}</p>
                </div>
              )}

              {project.githubUrl && (
                <div className="workspace__section">
                  <h3 className="workspace__section-title">Source Repository</h3>
                  <p style={{ marginBottom: 'var(--space-2)' }}>
                    Engineering source code, setup instructions, and firmware are maintained on GitHub:
                  </p>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--secondary mono"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span>{project.githubUrl}</span>
                    <span style={{ color: 'var(--color-accent-green)' }}>↗</span>
                  </a>
                </div>
              )}

              <div className="workspace__section">
                <h3 className="workspace__section-title">Technologies & Hardware Tooling</h3>
                <div className="workspace__tech-grid">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="workspace__tech-tag mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE (3D CAD, 3D PCB, OR ARCHITECTURE) */}
          {activeTab === 'interactive' && (
            <div className="workspace__interactive">
              {isPCBProject ? (
                <>
                  <ThreeDViewer
                    modelType="pcb"
                    title={`${project.title} (3D PCB Model)`}
                    onExit={() => setActiveTab('overview')}
                  />
                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <ArchitectureDiagram defaultProjectId={project.id} />
                  </div>
                </>
              ) : hasCADModel ? (
                <>
                  <ThreeDViewer
                    modelType={(['sxs-spaceframe', 'handheld-controller', 'mtb-frame'].includes(project.id) ? project.id : 'sxs-spaceframe') as 'sxs-spaceframe' | 'handheld-controller' | 'mtb-frame'}
                    modelUrl={project.modelUrl}
                    modelRotation={project.modelRotation}
                    title={`${project.title} (3D CAD View)`}
                    onExit={() => setActiveTab('overview')}
                  />
                  {hasArchDiagram && (
                    <div style={{ marginTop: 'var(--space-6)' }}>
                      <ArchitectureDiagram defaultProjectId={project.id} />
                    </div>
                  )}
                </>
              ) : hasArchDiagram ? (
                <ArchitectureDiagram defaultProjectId={project.id} />
              ) : (
                <WebPreview projectTitle={project.title} />
              )}

              {/* Live Git Graph only for projects hosted on GitHub */}
              {project.githubUrl && (
                <div style={{ marginTop: 'var(--space-6)' }}>
                  <GitHistoryDiagram
                    repoName={project.githubUrl.split('/').pop()?.replace('.git', '') || project.id}
                    defaultBranch="main"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="workspace__gallery">
              {project.images && project.images.length > 0 ? (
                <div className="workspace__gallery-grid">
                  {project.images.map((img, i) => (
                    <figure
                      key={i}
                      className="workspace__gallery-item"
                      onClick={() => setActiveLightboxIndex(i)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={img.src} alt={img.alt} loading="lazy" />
                      <figcaption>
                        <span>{img.caption}</span>
                        <span className="mono" style={{ color: 'var(--color-accent-green)', marginLeft: 'auto' }}>
                          Inspect 🔍
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : (
                <div className="workspace__empty-state">
                  <p>No CAD renderings or hardware photographs available for this item yet.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TECHNICAL SPECS */}
          {activeTab === 'specs' && (
            <div className="workspace__specs">
              <div className="workspace__info-grid">
                <div className="workspace__info-item">
                  <span className="workspace__info-label mono">Current Stage</span>
                  <span className="workspace__info-value" style={{ color: stage?.color }}>
                    {stage?.label}
                  </span>
                </div>
                <div className="workspace__info-item">
                  <span className="workspace__info-label mono">Primary Domain</span>
                  <span className="workspace__info-value">{category?.label}</span>
                </div>
                <div className="workspace__info-item">
                  <span className="workspace__info-label mono">Engineering Status</span>
                  <span className="workspace__info-value">{project.status}</span>
                </div>
                <div className="workspace__info-item">
                  <span className="workspace__info-label mono">Toolchain / Stack</span>
                  <span className="workspace__info-value">{project.technologies.join(', ')}</span>
                </div>
              </div>

              <div className="workspace__section" style={{ marginTop: 'var(--space-4)' }}>
                <h3 className="workspace__section-title">Engineering Verification Notes</h3>
                <p className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                  • Architecture validation: Compliant with standard embedded low-voltage tolerances.<br />
                  • Fabrication readiness: Models aligned with standard CNC, 3D printing, and PCB manufacturing design rules (DRC).<br />
                  • Source authority: Maintained in Jeffrey Murithi's engineering repository.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Lightbox for Gallery */}
        <AnimatePresence>
          {activeLightboxIndex !== null && project.images && (
            <ImageViewer
              images={project.images}
              initialIndex={activeLightboxIndex}
              onClose={() => setActiveLightboxIndex(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
