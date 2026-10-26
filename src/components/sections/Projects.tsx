/* ============================================================
   PROJECTS DASHBOARD — Search, filter, project cards
   ============================================================ */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staticProjects } from '../../config/site';
import { stageConfig, categoryConfig } from '../../config/site';
import type { StaticProject } from '../../types';
import ProjectWorkspace from './ProjectWorkspace';
import './Projects.css';

export default function Projects() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stage'>('name');
  const [selectedProject, setSelectedProject] = useState<StaticProject | null>(null);

  // Deep linking: Open project if hash matches
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('project-')) {
        const projectId = hash.replace('project-', '');
        const found = staticProjects.find((p) => p.id === projectId);
        if (found) setSelectedProject(found);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenProject = (project: StaticProject) => {
    setSelectedProject(project);
    window.history.replaceState(null, '', `#project-${project.id}`);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    window.history.replaceState(null, '', '#projects');
  };

  const categories = useMemo(() => {
    const cats = new Set(staticProjects.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const stages = useMemo(() => {
    const stgs = new Set(staticProjects.map((p) => p.stage));
    return ['all', ...Array.from(stgs)];
  }, []);

  const filteredProjects = useMemo(() => {
    let results = [...staticProjects];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (categoryFilter !== 'all') {
      results = results.filter((p) => p.category === categoryFilter);
    }

    if (stageFilter !== 'all') {
      results = results.filter((p) => p.stage === stageFilter);
    }

    results.sort((a, b) => {
      if (sortBy === 'stage') {
        return (stageConfig[a.stage]?.order ?? 10) - (stageConfig[b.stage]?.order ?? 10);
      }
      return a.title.localeCompare(b.title);
    });

    return results;
  }, [search, categoryFilter, stageFilter, sortBy]);

  return (
    <section className="projects section" id="projects">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Engineering Projects</span>
          <h2 className="section-title">Project Dashboard</h2>
        </div>

        {/* Search & Filters */}
        <div className="projects__controls">
          <div className="projects__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder="Search projects, technologies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="projects__search-input"
              id="project-search"
            />
          </div>

          <div className="projects__filters">
            <div className="projects__filter-group">
              <label className="projects__filter-label mono" htmlFor="category-filter">Category</label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="projects__select"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : categoryConfig[c]?.label || c}
                  </option>
                ))}
              </select>
            </div>

            <div className="projects__filter-group">
              <label className="projects__filter-label mono" htmlFor="stage-filter">Stage</label>
              <select
                id="stage-filter"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="projects__select"
              >
                {stages.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All Stages' : stageConfig[s]?.label || s}
                  </option>
                ))}
              </select>
            </div>

            <div className="projects__filter-group">
              <label className="projects__filter-label mono" htmlFor="sort-filter">Sort</label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'stage')}
                className="projects__select"
              >
                <option value="name">Name</option>
                <option value="stage">Stage</option>
              </select>
            </div>
          </div>
        </div>

        <p className="projects__count mono">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
        </p>

        {/* Project Grid */}
        <div className="projects__grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                className="project-card"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleOpenProject(project)}
                tabIndex={0}
                role="button"
                aria-label={`Open project: ${project.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenProject(project);
                  }
                }}
              >
                {/* Thumbnail */}
                {project.images && project.images.length > 0 ? (
                  <div className="project-card__image">
                    <img src={project.images[0].src} alt={project.images[0].alt} loading="lazy" />
                  </div>
                ) : (
                  <div className="project-card__image project-card__image--placeholder">
                    <span className="project-card__icon">{categoryConfig[project.category]?.icon || '📋'}</span>
                  </div>
                )}

                <div className="project-card__body">
                  {/* Stage & Category Badges */}
                  <div className="project-card__badges">
                    <span
                      className="project-card__badge project-card__badge--stage"
                      style={{ '--badge-color': stageConfig[project.stage]?.color } as React.CSSProperties}
                    >
                      {stageConfig[project.stage]?.label || project.stage}
                    </span>
                    <span className="project-card__badge project-card__badge--category">
                      {categoryConfig[project.category]?.icon} {categoryConfig[project.category]?.label}
                    </span>
                  </div>

                  <h3 className="project-card__title">{project.title}</h3>
                  <p className="project-card__description">{project.description}</p>

                  {/* Technologies */}
                  <div className="project-card__tech">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="project-card__tech-tag mono">{tech}</span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="project-card__tech-tag mono">+{project.technologies.length - 4}</span>
                    )}
                  </div>

                  <div className="project-card__footer">
                    <span className="project-card__status mono">{project.status}</span>
                    <span className="project-card__action">
                      Open
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <div className="projects__empty">
            <p>No projects match your filters.</p>
            <button onClick={() => { setSearch(''); setCategoryFilter('all'); setStageFilter('all'); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Project Workspace Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectWorkspace
            project={selectedProject}
            onClose={handleCloseProject}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
