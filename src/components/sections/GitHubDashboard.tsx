/* ============================================================
   GITHUB INTELLIGENCE DASHBOARD
   Live GitHub API discovery, topic-based repo ingestion,
   rate limit metrics, and sync status
   ============================================================ */

import { useState, useEffect } from 'react';
import { syncPortfolioProjects, getSyncState } from '../../services/github';
import { siteConfig } from '../../config/site';
import type { PortfolioProject, SyncState } from '../../types';
import './GitHubDashboard.css';

interface GitHubDashboardProps {
  onProjectsSynced?: (projects: PortfolioProject[]) => void;
}

export default function GitHubDashboard({ onProjectsSynced }: GitHubDashboardProps) {
  const [syncState, setSyncState] = useState<SyncState>(getSyncState());
  const [syncedProjects, setSyncedProjects] = useState<PortfolioProject[]>([]);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  useEffect(() => {
    // Initial sync
    handleSync();
  }, []);

  const handleSync = async () => {
    setIsManualSyncing(true);
    setSyncState((prev) => ({ ...prev, status: 'syncing' }));

    try {
      const result = await syncPortfolioProjects();
      setSyncedProjects(result.projects);
      setSyncState({
        lastSync: result.syncTimestamp,
        status: result.status === 'error' ? 'error' : 'success',
        projectCount: result.projects.length,
      });
      if (onProjectsSynced) {
        onProjectsSynced(result.projects);
      }
    } catch (err) {
      console.error('Error during manual GitHub sync:', err);
      setSyncState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: err instanceof Error ? err.message : 'Unknown sync failure',
      }));
    } finally {
      setIsManualSyncing(false);
    }
  };

  return (
    <section className="gh-dashboard section" id="telemetry">
      <div className="container">
        <div className="gh-dashboard__header">
          <div className="gh-dashboard__title-group">
            <span className="section-label mono">TELEMETRY & BUILD ACTIVITY</span>
            <h2 className="section-title">Project Track</h2>
          </div>

          {/* Sync Trigger and Status Indicator */}
          <div className="gh-dashboard__controls">
            <div className="gh-dashboard__status-pill mono">
              <span className={`status-led ${syncState.status}`} />
              <span>
                {syncState.status === 'syncing'
                  ? 'Syncing with GitHub API...'
                  : syncState.status === 'success'
                  ? 'API Ingest Active'
                  : 'Cached Offline Mode'}
              </span>
            </div>

            <button
              className="btn btn--secondary mono gh-dashboard__sync-btn"
              onClick={handleSync}
              disabled={isManualSyncing}
            >
              <svg
                className={isManualSyncing ? 'spinning' : ''}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              {isManualSyncing ? 'Ingesting...' : 'Sync Now'}
            </button>
          </div>
        </div>

        {/* Intelligence Stats Cards */}
        <div className="gh-dashboard__stats-grid">
          <div className="gh-stat-card">
            <span className="gh-stat-card__label mono">Target Profile</span>
            <div className="gh-stat-card__value-group">
              <span className="gh-stat-card__val mono">@{siteConfig.github.username}</span>
            </div>
            <span className="gh-stat-card__sub mono">GitHub REST API v3</span>
          </div>

          <div className="gh-stat-card">
            <span className="gh-stat-card__label mono">Discovery Topic</span>
            <div className="gh-stat-card__value-group">
              <span className="gh-stat-card__val mono">#{siteConfig.github.portfolioTopic}</span>
            </div>
            <span className="gh-stat-card__sub mono">Tagged Repositories</span>
          </div>

          <div className="gh-stat-card">
            <span className="gh-stat-card__label mono">Manifest Standard</span>
            <div className="gh-stat-card__value-group">
              <span className="gh-stat-card__val mono">portfolio.project.json</span>
            </div>
            <span className="gh-stat-card__sub mono">Schema v1.0 Validated</span>
          </div>

          <div className="gh-stat-card">
            <span className="gh-stat-card__label mono">Last Sync Timestamp</span>
            <div className="gh-stat-card__value-group">
              <span className="gh-stat-card__val mono">
                {syncState.lastSync ? new Date(syncState.lastSync).toLocaleTimeString() : 'Fresh'}
              </span>
            </div>
            <span className="gh-stat-card__sub mono">Hourly Cron Triggered</span>
          </div>
        </div>

        {/* Discovered GitHub Projects or Live Ingestion Table */}
        {syncedProjects.length > 0 && (
          <div className="gh-dashboard__repos">
            <h3 className="gh-dashboard__repos-title mono">
              DISCOVERED TOPIC REPOSITORIES ({syncedProjects.length})
            </h3>
            <div className="gh-dashboard__repos-grid">
              {syncedProjects.map((p) => (
                <div key={p.id} className="gh-repo-card">
                  <div className="gh-repo-card__top">
                    <span className="gh-repo-card__name mono">{p.repository.name}</span>
                    <span className="gh-repo-card__stars mono">★ {p.repository.stargazersCount}</span>
                  </div>
                  <p className="gh-repo-card__desc">
                    {p.manifest?.description || p.repository.description || 'No description provided.'}
                  </p>
                  <div className="gh-repo-card__tech">
                    {p.manifest?.technologies?.map((t) => (
                      <span key={t} className="mono tag">{t}</span>
                    ))}
                  </div>
                  <div className="gh-repo-card__bottom">
                    <span className="mono status">Stage: {p.manifest?.stage || 'unknown'}</span>
                    <a
                      href={p.repository.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono repo-link"
                    >
                      Repo →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
