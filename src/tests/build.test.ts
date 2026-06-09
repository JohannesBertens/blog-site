import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

describe('Build smoke test', () => {
  it('package.json has required scripts', () => {
    const pkg = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf-8'));
    expect(pkg.scripts).toBeDefined();
    expect(pkg.scripts.build).toBe('astro build');
  });

  it('astro.config.mjs exists', () => {
    expect(existsSync(resolve(__dirname, '../../astro.config.mjs'))).toBe(true);
  });

  it('source directory structure exists', () => {
    expect(existsSync(resolve(__dirname, '../pages'))).toBe(true);
    expect(existsSync(resolve(__dirname, '../layouts'))).toBe(true);
    expect(existsSync(resolve(__dirname, '../components'))).toBe(true);
  });

  it('public styles directory has required CSS files', () => {
    const stylesDir = resolve(__dirname, '../../public/styles');
    expect(existsSync(resolve(stylesDir, 'main.css'))).toBe(true);
    expect(existsSync(resolve(stylesDir, 'base.css'))).toBe(true);
    expect(existsSync(resolve(stylesDir, 'tokens.css'))).toBe(true);
  });
});
