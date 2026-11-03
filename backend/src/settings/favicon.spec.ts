import { buildFavicon } from './favicon';

describe('buildFavicon', () => {
  it('renders the requested icon with the accent color', () => {
    const svg = buildFavicon('star', '#123abc');
    expect(svg).toContain('<polygon');
    expect(svg).toContain('stroke="#123abc"');
    expect(svg).toContain('viewBox="0 0 24 24"');
    expect(svg).not.toContain('currentColor');
    expect(svg).not.toContain('class=');
  });

  it('falls back to terminal for unknown or missing types', () => {
    const terminal = buildFavicon('terminal', '#123abc');
    expect(buildFavicon('nope', '#123abc')).toBe(terminal);
    expect(buildFavicon('constructor', '#123abc')).toBe(terminal);
    expect(buildFavicon(undefined, '#123abc')).toBe(terminal);
  });

  it('falls back to the default color when the color is invalid', () => {
    expect(buildFavicon('code', '"/><script>alert(1)</script>')).toContain('stroke="#F5A623"');
    expect(buildFavicon('code', 'red')).toContain('stroke="#F5A623"');
    expect(buildFavicon('code', null)).toContain('stroke="#F5A623"');
  });
});
