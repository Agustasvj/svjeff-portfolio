/* ============================================================
   GITHUB SERVICE — Repository Discovery & Data Fetching
   Handles curated portfolio-topic-based repo discovery.
   ============================================================ */

import type {
  RepositoryMetadata,
  Commit,
  Branch,
  Release,
  WorkflowRun,
  PullRequest,
  PortfolioProject,
  ProjectManifest,
} from '../types';
import { siteConfig } from '../config/site';

const API_BASE = 'https://api.github.com';
const { username, portfolioTopic, maxCommitsPerRepo, maxBranchesPerRepo } = siteConfig.github;

/* ── Rate Limit Handling ── */
let rateLimitRemaining = 60;
let rateLimitReset = 0;

function checkRateLimit(response: Response) {
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');
  if (remaining) rateLimitRemaining = parseInt(remaining, 10);
  if (reset) rateLimitReset = parseInt(reset, 10);
}

async function fetchGitHub<T>(path: string): Promise<T | null> {
  if (rateLimitRemaining <= 5) {
    const now = Math.floor(Date.now() / 1000);
    if (now < rateLimitReset) {
      console.warn(`[GitHub] Rate limited. Resets at ${new Date(rateLimitReset * 1000).toISOString()}`);
      return null;
    }
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    checkRateLimit(response);

    if (!response.ok) {
      if (response.status === 403) {
        console.warn('[GitHub] Rate limit or access restriction');
        return null;
      }
      if (response.status === 404) {
        return null;
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[GitHub] Fetch error for ${path}:`, error);
    return null;
  }
}

/* ── Repository Discovery ── */
export async function discoverPortfolioRepos(): Promise<RepositoryMetadata[]> {
  // Strategy: fetch user repos and filter by exact topic match
  const repos: RepositoryMetadata[] = [];
  let page = 1;
  const perPage = 100;

  while (page <= 10) { // Max 10 pages = 1000 repos
    const data = await fetchGitHub<Array<Record<string, unknown>>>(
      `/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
    );

    if (!data || data.length === 0) break;

    for (const repo of data) {
      const topics = repo.topics as string[] || [];
      // Exact topic match — only repos with the exact portfolio topic
      if (topics.includes(portfolioTopic)) {
        repos.push(mapRepository(repo));
      }
    }

    if (data.length < perPage) break;
    page++;
  }

  return repos;
}

function mapRepository(raw: Record<string, unknown>): RepositoryMetadata {
  return {
    name: raw.name as string,
    fullName: raw.full_name as string,
    url: raw.html_url as string,
    description: raw.description as string | null,
    topics: (raw.topics as string[]) || [],
    defaultBranch: raw.default_branch as string,
    language: raw.language as string | null,
    stargazersCount: raw.stargazers_count as number,
    forksCount: raw.forks_count as number,
    openIssuesCount: raw.open_issues_count as number,
    createdAt: raw.created_at as string,
    updatedAt: raw.updated_at as string,
    pushedAt: raw.pushed_at as string,
    isArchived: raw.archived as boolean,
    isFork: raw.fork as boolean,
    hasPages: raw.has_pages as boolean,
    homepage: raw.homepage as string | null,
    license: (raw.license as Record<string, string>)?.spdx_id || null,
  };
}

/* ── Repository Details ── */
export async function fetchCommits(repoName: string): Promise<Commit[]> {
  const data = await fetchGitHub<Array<Record<string, unknown>>>(
    `/repos/${username}/${repoName}/commits?per_page=${maxCommitsPerRepo}`
  );

  if (!data) return [];

  return data.map((c) => {
    const commit = c.commit as Record<string, unknown>;
    const author = commit.author as Record<string, string>;
    const parents = (c.parents as Array<Record<string, string>>) || [];
    const sha = c.sha as string;
    return {
      sha,
      shortSha: sha.substring(0, 7),
      message: (commit.message as string).split('\n')[0],
      author: author?.name || 'Unknown',
      date: author?.date || '',
      url: c.html_url as string,
      parents: parents.map((p) => p.sha),
    };
  });
}

export async function fetchBranches(repoName: string): Promise<Branch[]> {
  const data = await fetchGitHub<Array<Record<string, unknown>>>(
    `/repos/${username}/${repoName}/branches?per_page=${maxBranchesPerRepo}`
  );

  if (!data) return [];

  const repo = await fetchGitHub<Record<string, unknown>>(
    `/repos/${username}/${repoName}`
  );
  const defaultBranch = (repo?.default_branch as string) || 'main';

  return data.map((b) => {
    const commit = b.commit as Record<string, unknown>;
    return {
      name: b.name as string,
      isDefault: b.name === defaultBranch,
      lastCommitSha: commit.sha as string,
      lastCommitDate: '',
    };
  });
}

export async function fetchReleases(repoName: string): Promise<Release[]> {
  const data = await fetchGitHub<Array<Record<string, unknown>>>(
    `/repos/${username}/${repoName}/releases?per_page=10`
  );

  if (!data) return [];

  return data.map((r) => ({
    tagName: r.tag_name as string,
    name: (r.name as string) || '',
    body: (r.body as string) || '',
    createdAt: r.created_at as string,
    url: r.html_url as string,
    isDraft: r.draft as boolean,
    isPrerelease: r.prerelease as boolean,
  }));
}

export async function fetchWorkflowRuns(repoName: string): Promise<WorkflowRun[]> {
  const data = await fetchGitHub<Record<string, unknown>>(
    `/repos/${username}/${repoName}/actions/runs?per_page=5`
  );

  if (!data) return [];
  const runs = (data.workflow_runs as Array<Record<string, unknown>>) || [];

  return runs.map((r) => ({
    id: r.id as number,
    name: r.name as string,
    status: r.status as WorkflowRun['status'],
    conclusion: r.conclusion as string | null,
    createdAt: r.created_at as string,
    url: r.html_url as string,
  }));
}

export async function fetchPullRequests(repoName: string): Promise<PullRequest[]> {
  const data = await fetchGitHub<Array<Record<string, unknown>>>(
    `/repos/${username}/${repoName}/pulls?state=all&per_page=10&sort=updated`
  );

  if (!data) return [];

  return data.map((pr) => {
    const user = pr.user as Record<string, string>;
    return {
      number: pr.number as number,
      title: pr.title as string,
      state: (pr.merged_at ? 'merged' : pr.state) as PullRequest['state'],
      author: user?.login || 'Unknown',
      createdAt: pr.created_at as string,
      mergedAt: pr.merged_at as string | null,
      url: pr.html_url as string,
    };
  });
}

/* ── Project Manifest ── */
export async function fetchManifest(repoName: string, defaultBranch: string): Promise<ProjectManifest | null> {
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/${username}/${repoName}/${defaultBranch}/portfolio.project.json`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return validateManifest(data);
  } catch {
    return null;
  }
}

function validateManifest(data: unknown): ProjectManifest | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;

  const validStages = ['concept', 'requirements', 'design', 'implementation', 'prototype', 'testing', 'released', 'on-hold', 'archived', 'blocked', 'unknown'];
  const validCategories = ['embedded', 'iot', 'electronics', 'pcb', 'mechanical-cad', 'software', 'automotive', 'product-design', 'other'];

  const stage = validStages.includes(d.stage as string) ? d.stage as string : 'unknown';
  const category = validCategories.includes(d.category as string) ? d.category as string : 'other';

  return {
    schemaVersion: (d.schemaVersion as number) || 1,
    featured: Boolean(d.featured),
    title: (d.title as string) || '',
    description: (d.description as string) || '',
    category: category as ProjectManifest['category'],
    stage: stage as ProjectManifest['stage'],
    technologies: Array.isArray(d.technologies) ? d.technologies : [],
    diagram: d.diagram as ProjectManifest['diagram'],
    preview: d.preview as ProjectManifest['preview'],
    media: d.media as ProjectManifest['media'],
    featuredOrder: typeof d.featuredOrder === 'number' ? d.featuredOrder : undefined,
    milestones: Array.isArray(d.milestones) ? d.milestones : undefined,
  };
}

/* ── Full Project Assembly ── */
export async function fetchFullProject(repo: RepositoryMetadata): Promise<PortfolioProject> {
  const [commits, branches, releases, workflowRuns, pullRequests, manifest] = await Promise.all([
    fetchCommits(repo.name),
    fetchBranches(repo.name),
    fetchReleases(repo.name),
    fetchWorkflowRuns(repo.name),
    fetchPullRequests(repo.name),
    fetchManifest(repo.name, repo.defaultBranch),
  ]);

  return {
    id: repo.name,
    manifest,
    repository: repo,
    commits,
    branches,
    pullRequests,
    releases,
    workflowRuns,
    lastSyncTimestamp: new Date().toISOString(),
    syncStatus: 'success',
  };
}

/* ── Sync All Portfolio Projects ── */
export async function syncPortfolioProjects(): Promise<{
  projects: PortfolioProject[];
  syncTimestamp: string;
  status: 'success' | 'partial' | 'error';
}> {
  try {
    const repos = await discoverPortfolioRepos();

    if (repos.length === 0) {
      return {
        projects: [],
        syncTimestamp: new Date().toISOString(),
        status: 'success',
      };
    }

    const results = await Promise.allSettled(
      repos.map((repo) => fetchFullProject(repo))
    );

    const projects: PortfolioProject[] = [];
    let hasFailures = false;

    for (const result of results) {
      if (result.status === 'fulfilled') {
        projects.push(result.value);
      } else {
        hasFailures = true;
        console.error('[GitHub] Failed to fetch project:', result.reason);
      }
    }

    return {
      projects,
      syncTimestamp: new Date().toISOString(),
      status: hasFailures ? 'partial' : 'success',
    };
  } catch (error) {
    console.error('[GitHub] Sync failed:', error);
    return {
      projects: [],
      syncTimestamp: new Date().toISOString(),
      status: 'error',
    };
  }
}

export function getRateLimitInfo() {
  return { remaining: rateLimitRemaining, reset: rateLimitReset };
}

let lastSyncTime: string | null = null;
let lastSyncStatus: 'idle' | 'syncing' | 'success' | 'error' = 'idle';

export function getSyncState() {
  return {
    lastSync: lastSyncTime,
    status: lastSyncStatus,
    projectCount: 0,
  };
}
