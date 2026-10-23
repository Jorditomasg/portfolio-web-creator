import { findPairedRepo, githubUser, matchTechnologies, normalizeRepoUrl, GithubRepo } from './github';

const repo = (name: string, extra: Partial<GithubRepo> = {}): GithubRepo => ({
  name, full_name: `me/${name}`, html_url: `https://github.com/me/${name}`, description: null, homepage: null,
  language: null, topics: [], fork: false, archived: false, created_at: '2024-01-01T00:00:00Z',
  pushed_at: '2024-01-01T00:00:00Z', stargazers_count: 0, ...extra,
});

describe('github pairing', () => {
  it('extracts the user from a profile url', () => {
    expect(githubUser('https://github.com/jorditomasg/')).toBe('jorditomasg');
    expect(githubUser('')).toBeNull();
  });

  it('normalizes repo urls', () => {
    expect(normalizeRepoUrl('https://www.GitHub.com/Me/Repo.git')).toBe('github.com/me/repo');
    expect(normalizeRepoUrl('http://github.com/me/repo/')).toBe('github.com/me/repo');
  });

  it('pairs by github_url first, then by title', () => {
    const repos = [repo('portfolio-web-creator'), repo('trading-bot')];
    expect(findPairedRepo({ title: 'x', github_url: 'https://github.com/me/trading-bot/' }, repos)?.name).toBe('trading-bot');
    expect(findPairedRepo({ title: 'Portfolio Web Creator', github_url: null }, repos)?.name).toBe('portfolio-web-creator');
    expect(findPairedRepo({ title: 'Portfolio-Web-Creator' }, repos)?.name).toBe('portfolio-web-creator');
    // a project with a url that matches nothing must NOT fall back to title
    expect(findPairedRepo({ title: 'trading-bot', github_url: 'https://github.com/me/other' }, repos)).toBeUndefined();
  });

  it('matches technologies from language and topics', () => {
    const techs = [{ name: 'TypeScript' }, { name: 'Node.js' }, { name: 'Angular' }, { name: 'Go' }];
    const r = repo('x', { language: 'TypeScript', topics: ['nodejs', 'angular'] });
    expect(matchTechnologies(r, techs).map(t => t.name)).toEqual(['TypeScript', 'Node.js', 'Angular']);
  });
});
