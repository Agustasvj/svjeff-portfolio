/* ============================================================
   GIT HISTORY DIAGRAM COMPONENT
   Interactive commit graph & branch timeline visualization
   ============================================================ */

import { useState } from 'react';
import type { Commit } from '../../types';
import './GitHistoryDiagram.css';

interface GitHistoryDiagramProps {
  commits?: Commit[];
  repoName?: string;
  defaultBranch?: string;
}

const DEFAULT_COMMITS: Commit[] = [
  {
    sha: 'a41d9e2b1c8f3074e58a2d10c9e6b4f738a1d052',
    shortSha: 'a41d9e2',
    message: 'release: v2.0.0 16-channel low-latency UDP binary streaming and telemetry HUD',
    author: 'Jeffrey Murithi',
    date: '2026-04-12T16:45:00Z',
    url: 'https://github.com/Agustasvj/VFORCETXRX',
    parents: ['8c3b7a1'],
  },
  {
    sha: '8c3b7a1d0e5f2948b17c3a06e9d4f2b819a0c7e4',
    shortSha: '8c3b7a1',
    message: 'feat: add failsafe watchdog timer to cut throttle on Wi-Fi connection loss',
    author: 'Jeffrey Murithi',
    date: '2026-04-10T11:20:00Z',
    url: 'https://github.com/Agustasvj/VFORCETXRX',
    parents: ['5e2a9d4'],
  },
  {
    sha: '5e2a9d4f7c1b8036e9a4d208c1f7b3a928e0d6c1',
    shortSha: '5e2a9d4',
    message: 'refactor: optimize exponential curve calculation and dual-rate mappings',
    author: 'Jeffrey Murithi',
    date: '2026-04-06T19:30:00Z',
    url: 'https://github.com/Agustasvj/VFORCETXRX',
    parents: ['3b9f1c7', '7d4e2a8'],
  },
  {
    sha: '7d4e2a8c1f0b9347e6a5d109c8f2b4a139e0c5d2',
    shortSha: '7d4e2a8',
    message: 'feat: implement dual virtual joysticks with multi-touch tracking in web UI',
    author: 'Jeffrey Murithi',
    date: '2026-04-02T14:15:00Z',
    url: 'https://github.com/Agustasvj/VFORCETXRX',
    parents: ['3b9f1c7'],
  },
  {
    sha: '3b9f1c7e9a4d208c1f7b3a928e0d6c1a41d9e2b1',
    shortSha: '3b9f1c7',
    message: 'feat: ESP32 receiver firmware with hardware PWM output and voltage ADC telemetry',
    author: 'Jeffrey Murithi',
    date: '2026-03-28T10:00:00Z',
    url: 'https://github.com/Agustasvj/VFORCETXRX',
    parents: ['1a0d8e4'],
  },
  {
    sha: '1a0d8e4f2c9b7348e5a1d069c7f3b2a018e9c4d1',
    shortSha: '1a0d8e4',
    message: 'init: FastAPI async server and WebSocket bridge structure',
    author: 'Jeffrey Murithi',
    date: '2026-03-22T08:30:00Z',
    url: 'https://github.com/Agustasvj/VFORCETXRX',
    parents: [],
  },
];

export default function GitHistoryDiagram({
  commits = DEFAULT_COMMITS,
  repoName = 'VFORCETXRX',
  defaultBranch = 'main',
}: GitHistoryDiagramProps) {
  const [selectedCommit, setSelectedCommit] = useState<Commit>(commits[0]);
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
          <span>{commits.length} commits</span>
          <span className="dot">•</span>
          <span className="git-diagram__sync-state">Live Git Graph</span>
        </div>
      </div>

      <div className="git-diagram__body">
        {/* Branch / Timeline Graph */}
        <div className="git-diagram__timeline">
          {commits.map((commit, idx) => {
            const isSelected = selectedCommit.sha === commit.sha;
            const isMerge = commit.parents.length > 1;

            return (
              <div
                key={commit.sha}
                className={`git-diagram__row ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedCommit(commit)}
                role="button"
                tabIndex={0}
              >
                {/* Visual Branch Line Rail */}
                <div className="git-diagram__rail">
                  <div className="git-diagram__line-top" style={{ visibility: idx === 0 ? 'hidden' : 'visible' }} />
                  <div className={`git-diagram__node ${isMerge ? 'merge' : ''} ${isSelected ? 'active' : ''}`} />
                  <div className="git-diagram__line-bottom" style={{ visibility: idx === commits.length - 1 ? 'hidden' : 'visible' }} />
                </div>

                {/* Commit Content */}
                <div className="git-diagram__commit-summary">
                  <div className="git-diagram__commit-top">
                    <span className="git-diagram__sha mono">{commit.shortSha}</span>
                    <span className="git-diagram__date mono">{new Date(commit.date).toLocaleDateString()}</span>
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
                {selectedCommit.parents.length > 0
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
