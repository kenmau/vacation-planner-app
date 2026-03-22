import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Regression test: dark mode card backgrounds were nearly black (#171717 / oklch(0.205 0 0))
 * making content unreadable. Both light and dark mode now use a light blue palette.
 */
describe('theme colors - should use light blue palette in both modes', () => {
  const cssContent = readFileSync(
    resolve(__dirname, '../src/app/globals.css'),
    'utf-8'
  );

  it('should not use near-black card color #171717', () => {
    expect(cssContent).not.toContain('--card: #171717');
  });

  it('should not use near-black card color oklch(0.205 0 0)', () => {
    expect(cssContent).not.toContain('--card: oklch(0.205 0 0)');
  });

  it('should not use near-black background oklch(0.145 0 0)', () => {
    expect(cssContent).not.toContain('--background: oklch(0.145 0 0)');
  });

  it('should not use any dark backgrounds (#0f172a, #082f49, etc.)', () => {
    expect(cssContent).not.toContain('--background: #0f172a');
    expect(cssContent).not.toContain('--background: #082f49');
    expect(cssContent).not.toContain('--card: #1e293b');
    expect(cssContent).not.toContain('--card: #0c4a6e');
  });

  it('dark mode should use light blue background', () => {
    expect(cssContent).toContain('--background: #e8f0fe');
  });

  it('dark mode should use light blue card', () => {
    expect(cssContent).toContain('--card: #f0f5ff');
  });

  it('light mode background should be near-white with a blue tint', () => {
    expect(cssContent).toContain('--background: #f8fbff');
  });
});
