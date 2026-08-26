import { describe, it, expect } from 'vitest';

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return `${text.slice(0, idx)}<mark>${text.slice(idx, idx + query.length)}</mark>${text.slice(idx + query.length)}`;
}

describe('highlightMatch', () => {
  it('highlights matched substring', () => {
    expect(highlightMatch('Ammar Hisyam', 'ammar')).toContain('<mark>Ammar</mark>');
  });
  it('returns original when no match', () => {
    expect(highlightMatch('Design', 'engineering')).toBe('Design');
  });
  it('handles empty query', () => {
    expect(highlightMatch('Marketing', '')).toBe('Marketing');
  });
});
