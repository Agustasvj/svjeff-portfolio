/* ============================================================
   TYPE DEFINITIONS — Engineering Portfolio 2.0
   ============================================================ */

/* ── Engineering Stages ── */
export type EngineeringStage =
  | 'concept'
  | 'requirements'
  | 'design'
  | 'implementation'
  | 'prototype'
  | 'testing'
  | 'released'
  | 'on-hold'
  | 'archived'
  | 'blocked'
  | 'unknown';

export type ProjectCategory =
  | 'embedded'
  | 'iot'
  | 'electronics'
  | 'pcb'
  | 'mechanical-cad'
  | 'software'
  | 'automotive'
  | 'product-design'
  | 'other';

/* ── Project Manifest (portfolio.project.json) ── */
export interface ProjectManifest {
  schemaVersion: number;
  featured: boolean;
  title: string;
  description: string;
  category: ProjectCategory;
  stage: EngineeringStage;
  technologies: string[];
  diagram?: {
    architecture?: string;
  };
  preview?: {
    type: 'web' | 'image' | 'video' | 'cad' | 'none';
    url?: string;
  };
  media?: {
    thumbnail?: string;
    model?: string;
    images?: string[];
    video?: string;
  };
  featuredOrder?: number;
  milestones?: ProjectMilestone[];
}

export interface ProjectMilestone {
  name: string;
  completed: boolean;
}

/* ── GitHub Repository Data ── */
export interface RepositoryMetadata {
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  topics: string[];
  defaultBranch: string;
  language: string | null;
  languages?: Record<string, number>;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  isArchived: boolean;
  isFork: boolean;
  hasPages: boolean;
  homepage: string | null;
  license: string | null;
}

export interface Commit {
  sha: string;
  shortSha: string;
  message: string;
  author: string;
  date: string;
  url: string;
  parents: string[];
}

export interface Branch {
  name: string;
  isDefault: boolean;
  lastCommitSha: string;
  lastCommitDate: string;
}

export interface PullRequest {
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  author: string;
  createdAt: string;
  mergedAt: string | null;
  url: string;
}

export interface Release {
  tagName: string;
  name: string;
  body: string;
  createdAt: string;
  url: string;
  isDraft: boolean;
  isPrerelease: boolean;
}

export interface WorkflowRun {
  id: number;
  name: string;
  status: 'completed' | 'in_progress' | 'queued' | 'failure';
  conclusion: string | null;
  createdAt: string;
  url: string;
}

/* ── Portfolio Project (combined) ── */
export interface PortfolioProject {
  id: string;
  manifest: ProjectManifest | null;
  repository: RepositoryMetadata;
  commits: Commit[];
  branches: Branch[];
  pullRequests: PullRequest[];
  releases: Release[];
  workflowRuns: WorkflowRun[];
  lastSyncTimestamp: string;
  syncStatus: 'success' | 'partial' | 'failed' | 'stale';
}

/* ── Static Projects (existing, no GitHub repo yet) ── */
export interface StaticProject {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  stage: EngineeringStage;
  technologies: string[];
  features?: string[];
  currentProgress?: string[];
  designFocus?: string[];
  outcome?: string;
  objective: string;
  status: string;
  modelUrl?: string;
  modelRotation?: [number, number, number];
  images?: ProjectImage[];
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
}

/* ── Certifications ── */
export interface Certification {
  id: string;
  issuer: string;
  title: string;
  date: string;
  expirationDate?: string;
  credentialId?: string;
  verifyUrl?: string;
  skills?: string[];
  badge?: string;
  certificate?: string;
}

/* ── Experience ── */
export interface ExperienceEntry {
  id: string;
  type: 'education' | 'work' | 'internship' | 'project';
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  skills?: string[];
}

/* ── Skills ── */
export interface SkillCategory {
  id: string;
  name: string;
  icon?: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon?: string;
}

/* ── Sync State ── */
export interface SyncState {
  lastSync: string | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
  projectCount: number;
}

/* ── Architecture Diagram ── */
export interface DiagramNode {
  id: string;
  label: string;
  type?: string;
  description?: string;
  technology?: string;
  x?: number;
  y?: number;
}

export interface DiagramEdge {
  source: string;
  target: string;
  label?: string;
}

export interface ArchitectureDiagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  title?: string;
}
