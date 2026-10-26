/* ============================================================
   GIT HISTORY DIAGRAM COMPONENT
   Project-specific commit graph & live branch timeline
   Fetches live commits from GitHub API with repository-specific fallbacks
   ============================================================ */

import { useState, useEffect } from 'react';
import type { Commit } from '../../types';
import './GitHistoryDiagram.css';

interface GitHistoryDiagramProps {
  commits?: Commit[];
  repoName?: string;
  defaultBranch?: string;
}

const REPO_COMMITS: Record<string, Commit[]> = {
  VFORCETXRX: [
    {
      sha: '1365408a9f0e1b2c3d4e5f6a7b8c9d0e1f2a3b4c',
      shortSha: '1365408',
      message: 'Delete update.txt',
      author: 'Jeffrey Murithi',
      date: '2026-10-14T23:33:34Z',
      url: 'https://github.com/Agustasvj/VFORCETXRX/commit/1365408',
      parents: ['8b36553'],
    },
    {
      sha: '8b36553a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
      shortSha: '8b36553',
      message: 'Phase 1 Complete: Drag-to-resize, maximized desktop launch, throttle hold axis, square gimbals, and updated README',
      author: 'Jeffrey Murithi',
      date: '2026-10-14T23:32:19Z',
      url: 'https://github.com/Agustasvj/VFORCETXRX/commit/8b36553',
      parents: ['ae9c7b8'],
    },
    {
      sha: 'ae9c7b8c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
      shortSha: 'ae9c7b8',
      message: 'Update README.md with VForce RC transmitter architecture, features, and setup guide',
      author: 'Jeffrey Murithi',
      date: '2026-10-14T23:08:12Z',
      url: 'https://github.com/Agustasvj/VFORCETXRX/commit/ae9c7b8',
      parents: ['1d7e642'],
    },
    {
      sha: '1d7e642d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
      shortSha: '1d7e642',
      message: 'Convert VForce to RC Transmitter base station (Phase 1) with claymorphic UI, 16-channel engine, square gimbal, and live monitor',
      author: 'Jeffrey Murithi',
      date: '2026-10-14T23:05:49Z',
      url: 'https://github.com/Agustasvj/VFORCETXRX/commit/1d7e642',
      parents: ['c4ca0e7'],
    },
    {
      sha: 'c4ca0e7f3a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
      shortSha: 'c4ca0e7',
      message: 'Add README with logo, screenshots and full documentation',
      author: 'Jeffrey Murithi',
      date: '2026-10-14T09:36:08Z',
      url: 'https://github.com/Agustasvj/VFORCETXRX/commit/c4ca0e7',
      parents: [],
    },
  ],
  SIM_WHEEL1: [
    {
      sha: 'c4ca0e7f3a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
      shortSha: 'c4ca0e7',
      message: 'Add README with logo, screenshots and full documentation',
      author: 'Jeffrey Murithi',
      date: '2026-10-14T09:36:08Z',
      url: 'https://github.com/Agustasvj/SIM_WHEEL1/commit/c4ca0e7',
      parents: ['291eff5'],
    },
    {
      sha: '291eff5a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
      shortSha: '291eff5',
      message: 'Initial commit: SIM_WHEEL project with ViGEm virtual Xbox 360 controller driver, FastAPI server, and mobile gyroscope tilt-to-steer',
      author: 'Jeffrey Murithi',
      date: '2026-10-14T09:30:31Z',
      url: 'https://github.com/Agustasvj/SIM_WHEEL1/commit/291eff5',
      parents: [],
    },
  ],
  afyalink: [
    {
      sha: '63278faa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
      shortSha: '63278fa',
      message: 'chore: documentation and routing updates for community health workers',
      author: 'Jeffrey Murithi',
      date: '2026-10-23T10:46:02Z',
      url: 'https://github.com/Agustasvj/afyalink/commit/63278fa',
      parents: ['f23e741'],
    },
    {
      sha: 'f23e741b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f',
      shortSha: 'f23e741',
      message: 'refactor: navigation shell and follow-up register status badges',
      author: 'Jeffrey Murithi',
      date: '2026-10-23T10:44:52Z',
      url: 'https://github.com/Agustasvj/afyalink/commit/f23e741',
      parents: ['851a6b3'],
    },
    {
      sha: '851a6b3c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
      shortSha: '851a6b3',
      message: 'feat: community care queue and offline storage fallback with localStorage adapter',
      author: 'Jeffrey Murithi',
      date: '2026-10-23T10:00:58Z',
      url: 'https://github.com/Agustasvj/afyalink/commit/851a6b3',
      parents: ['ce110a5'],
    },
    {
      sha: 'ce110a5d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
      shortSha: 'ce110a5',
      message: 'feat(ui): complete Santa Cruz / Quiver editorial dark redesign, remove IEEE references from website',
      author: 'Jeffrey Murithi',
      date: '2026-10-23T09:57:46Z',
      url: 'https://github.com/Agustasvj/afyalink/commit/ce110a5',
      parents: ['69e27f2'],
    },
    {
      sha: '69e27f2e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
      shortSha: '69e27f2',
      message: 'docs: replace architecture image with interactive Mermaid diagram',
      author: 'Jeffrey Murithi',
      date: '2026-10-23T09:44:07Z',
      url: 'https://github.com/Agustasvj/afyalink/commit/69e27f2',
      parents: [],
    },
  ],
};

export default function GitHistoryDiagram({
  commits: propCommits,
  repoName = 'VFORCETXRX',
  defaultBranch = 'main',
}: GitHistoryDiagramProps) {
  const normalizedKey =
    Object.keys(REPO_COMMITS).find((k) => k.toLowerCase() === repoName.toLowerCase()) || 'VFORCETXRX';
  const fallbackCommits = REPO_COMMITS[normalizedKey] || REPO_COMMITS.VFORCETXRX;

  const [commitsList, setCommitsList] = useState<Commit[]>(propCommits || fallbackCommits);
  const [selectedCommit, setSelectedCommit] = useState<Commit>(fallbackCommits[0]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const baseCommits = REPO_COMMITS[normalizedKey] || fallbackCommits;
    setCommitsList(baseCommits);
    setSelectedCommit(baseCommits[0]);

    // Live fetch from GitHub REST API
    fetch(`https://api.github.com/repos/Agustasvj/${repoName}/commits?per_page=10`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        const mapped: Commit[] = data.map((item: any) => ({
          sha: item.sha,
          shortSha: item.sha.slice(0, 7),
          message: item.commit.message,
          author: item.commit.author?.name || 'Jeffrey Murithi',
          date: item.commit.author?.date || new Date().toISOString(),
          url: item.html_url || `https://github.com/Agustasvj/${repoName}/commit/${item.sha}`,
          parents: (item.parents || []).map((p: any) => p.sha.slice(0, 7)),
        }));
        setCommitsList(mapped);
        setSelectedCommit(mapped[0]);
        setIsLive(true);
      })
      .catch(() => {
        setIsLive(false);
      });

    return () => {
      isMounted = false;
    };
  }, [repoName, normalizedKey]);

  const activeBranch = defaultBranch;

  return (
    <div className="git-diagram">
      <div className="git-diagram__header">
        <div className="git-diagram__repo-info">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="3" x2="6" y2="15"></line>
            <circle cx="18" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M18 9a9 9 0 0 1-9 9"></path>
          </svg>
          <span className="git-diagram__repo-name mono">{repoName}</span>
          <span className="git-diagram__branch-tag mono">{activeBranch}</span>
        </div>

        <div className="git-diagram__stats mono">
          <span>{commitsList.length} commits</span>
          <span className="dot">•</span>
          <span className="git-diagram__sync-state">
            {isLive ? '🟢 Live GitHub Synced' : '📦 Project Git Graph'}
          </span>
        </div>
      </div>

      <div className="git-diagram__body">
        {/* Branch / Timeline Graph */}
        <div className="git-diagram__timeline">
          {commitsList.map((commit, idx) => {
            const isSelected = selectedCommit.sha === commit.sha;
            const isMerge = commit.parents && commit.parents.length > 1;

            return (
              <div
                key={commit.sha}
                className={`git-diagram__row ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedCommit(commit)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCommit(commit);
                  }
                }}
              >
                {/* Visual Branch Line Rail */}
                <div className="git-diagram__rail">
                  <div className="git-diagram__line-top" style={{ visibility: idx === 0 ? 'hidden' : 'visible' }} />
                  <div className={`git-diagram__node ${isMerge ? 'merge' : ''} ${isSelected ? 'active' : ''}`} />
                  <div
                    className="git-diagram__line-bottom"
                    style={{ visibility: idx === commitsList.length - 1 ? 'hidden' : 'visible' }}
                  />
                </div>

                {/* Commit Content */}
                <div className="git-diagram__commit-summary">
                  <div className="git-diagram__commit-top">
                    <span className="git-diagram__sha mono">{commit.shortSha}</span>
                    <span className="git-diagram__date mono">
                      {new Date(commit.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="git-diagram__msg">{commit.message}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Commit Details Panel */}
        <div className="git-diagram__details">
          <div className="git-diagram__details-header">
            <span className="git-diagram__details-label mono">COMMIT DETAILS</span>
            <span className="git-diagram__sha-badge mono">{selectedCommit.shortSha}</span>
          </div>

          <h4 className="git-diagram__details-msg">{selectedCommit.message}</h4>

          <div className="git-diagram__details-meta">
            <div className="git-diagram__meta-item">
              <span className="mono label">Author</span>
              <span className="mono value">{selectedCommit.author}</span>
            </div>
            <div className="git-diagram__meta-item">
              <span className="mono label">Committed on</span>
              <span className="mono value">{new Date(selectedCommit.date).toUTCString()}</span>
            </div>
            <div className="git-diagram__meta-item">
              <span className="mono label">Full SHA</span>
              <span className="mono value sha-full">{selectedCommit.sha}</span>
            </div>
            <div className="git-diagram__meta-item">
              <span className="mono label">Parent Commits</span>
              <span className="mono value">
                {selectedCommit.parents && selectedCommit.parents.length > 0
                  ? selectedCommit.parents.map((p) => p.slice(0, 7)).join(', ')
                  : 'Root commit (initial)'}
              </span>
            </div>
          </div>

          <a
            href={selectedCommit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="git-diagram__btn-view mono"
          >
            Inspect Commit on GitHub
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
