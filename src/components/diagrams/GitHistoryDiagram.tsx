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
    sha: '9f8b2c4e1a6d3f5728b94017c6e4a2b189d0e1f3',
    shortSha: '9f8b2c4',
    message: 'release: v2.1.0 telemetry streaming over MQTT and OTA update routine',
    author: 'Jeffrey Murithi',
    date: '2026-03-20T14:32:00Z',
    url: 'https://github.com/Agustasvj',
    parents: ['4a7d1e8'],
  },
  {
    sha: '4a7d1e8c9b2f3a6e01d5478b2c9e4a1f87b3d2c1',
    shortSha: '4a7d1e8',
    message: 'feat: add hardware interrupt debounce for break-beam optical sensor',
    author: 'Jeffrey Murithi',
    date: '2026-03-18T10:15:00Z',
    url: 'https://github.com/Agustasvj',
    parents: ['7b2f4c1'],
  },
  {
    sha: '7b2f4c1e0a8d9b3f6c5e2a1d8f7b4c9e3a2d1e0f',
    shortSha: '7b2f4c1',
    message: 'refactor: integrate low-power deep sleep mode on Xtensa LX6 core',
    author: 'Jeffrey Murithi',
    date: '2026-03-14T17:40:00Z',
    url: 'https://github.com/Agustasvj',
    parents: ['1e3d5a7', '3c8a9e2'],
  },
  {
    sha: '3c8a9e2d1f0b7c4a5e8d2b9f1a7c3e5d0f8a4b2c',
    shortSha: '3c8a9e2',
    message: 'test: validate OV2640 frame buffer capture at UXGA resolution',
    author: 'Jeffrey Murithi',
    date: '2026-03-12T09:20:00Z',
    url: 'https://github.com/Agustasvj',
    parents: ['1e3d5a7'],
  },
  {
    sha: '1e3d5a7f9b8c2d4e0a6f3b1d7c9e5a2f8b0d4c6e',
    shortSha: '1e3d5a7',
    message: 'feat: prototype face detection embedding matching pipeline',
    author: 'Jeffrey Murithi',
    date: '2026-03-08T16:05:00Z',
    url: 'https://github.com/Agustasvj',
    parents: ['5d2a9f1'],
  },
  {
    sha: '5d2a9f1c7e4b8a3d0f6b2c9e1a8f4d7b3c0e6a5f',
    shortSha: '5d2a9f1',
    message: 'init: embedded platformio project configuration and pinout definition',
    author: 'Jeffrey Murithi',
    date: '2026-03-01T11:00:00Z',
    url: 'https://github.com/Agustasvj',
    parents: [],
  },
];

export default function GitHistoryDiagram({
  commits = DEFAULT_COMMITS,
  repoName = 'esp32-face-recognition',
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
