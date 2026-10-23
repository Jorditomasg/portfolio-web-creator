// Pure helpers for pairing portfolio projects with GitHub repos (kept separate so they're testable).

export interface GithubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  created_at: string;
  pushed_at: string;
  stargazers_count: number;
}

export const githubUser = (url?: string | null): string | null =>
  url?.match(/github\.com\/([^/?#]+)/i)?.[1] ?? null;

// "https://github.com/Me/Repo.git/" -> "github.com/me/repo"
export const normalizeRepoUrl = (url?: string | null): string =>
  (url ?? '').toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/\.git$|\/+$/g, '');

// "Node.js" / "node-js" / "NodeJS" -> "nodejs"
export const normalizeName = (s?: string | null): string => (s ?? '').toLowerCase().replace(/[^a-z0-9+#]/g, '');

export function findPairedRepo<P extends { title: string; github_url?: string | null }>(
  project: P,
  repos: GithubRepo[],
): GithubRepo | undefined {
  const url = normalizeRepoUrl(project.github_url);
  if (url) return repos.find(r => normalizeRepoUrl(r.html_url) === url);
  const title = normalizeName(project.title);
  return repos.find(r => normalizeName(r.name) === title);
}

// Repo language + topics matched against existing technology names.
export function matchTechnologies<T extends { name: string }>(repo: GithubRepo, techs: T[]): T[] {
  const wanted = new Set([repo.language, ...(repo.topics ?? [])].map(normalizeName).filter(Boolean));
  return techs.filter(t => wanted.has(normalizeName(t.name)));
}
