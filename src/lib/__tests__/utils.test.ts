import { describe, it, expect } from 'vitest';
import { formatDate, calculateReadingTime, formatCount } from '../utils';

describe('formatDate', () => {
  it('formats a date as YYYY-MM-DD', () => {
    const date = new Date('2025-11-05');
    expect(formatDate(date)).toBe('2025-11-05');
  });

  it('pads month and day with zeros', () => {
    const date = new Date('2025-01-03');
    expect(formatDate(date)).toBe('2025-01-03');
  });

  it('handles end of year', () => {
    const date = new Date('2025-12-31');
    expect(formatDate(date)).toBe('2025-12-31');
  });

  it('handles leap year date', () => {
    const date = new Date('2024-02-29');
    expect(formatDate(date)).toBe('2024-02-29');
  });
});

describe('calculateReadingTime', () => {
  it('returns 1 min read for short content', () => {
    const result = calculateReadingTime('Hello world');
    expect(result).toBe('1 min read');
  });

  it('returns correct time for longer content', () => {
    const words = 'word '.repeat(250);
    const result = calculateReadingTime(words);
    expect(result).toBe('3 min read');
  });

  it('strips code blocks from word count', () => {
    const content = '```js\nconsole.log("hello");\n```Some text here';
    const result = calculateReadingTime(content);
    expect(result).toBe('1 min read');
  });

  it('strips inline code from word count', () => {
    const content = '`code here` regular text words';
    const result = calculateReadingTime(content);
    expect(result).toBe('1 min read');
  });

  it('handles empty content', () => {
    const result = calculateReadingTime('');
    expect(result).toBe('1 min read');
  });
});

describe('formatCount', () => {
  it('formats numbers under 1000 as-is', () => {
    expect(formatCount(42)).toBe('42');
    expect(formatCount(999)).toBe('999');
  });

  it('formats thousands with K suffix', () => {
    expect(formatCount(1500)).toBe('1.5K');
    expect(formatCount(10000)).toBe('10.0K');
  });

  it('formats millions with M suffix', () => {
    expect(formatCount(1500000)).toBe('1.5M');
    expect(formatCount(2000000)).toBe('2.0M');
  });
});
