// The mark, drawn from a 3x3 grid: 24 unit pitch, 20 unit cells, 4 unit gaps and
// radius, in a 100 unit box. Two forms: the mark (two tones, the serif and the hook
// muted) and the solid mark (one tone). Everything in mark/ is generated from here.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const P = [16, 40, 64];
const rect = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fill}"/>`;
const cell = (cx, cy, fill) => rect(P[cx], P[cy], 20, 20, fill);
const bar = (cx0, cy0, cx1, cy1, fill) => rect(P[cx0], P[cy0], P[cx1] - P[cx0] + 20, P[cy1] - P[cy0] + 20, fill);

// stem, base, hook block, then the two end cells: top serif and hook tail
const body = fg => bar(2, 0, 2, 2, fg) + bar(1, 2, 2, 2, fg) + cell(0, 2, fg);
const mark = (fg, muted) => body(fg) + cell(0, 1, muted) + cell(1, 0, muted);
const solid = fg => mark(fg, fg);

const svg = (inner, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${title}">${inner}</svg>\n`;
const tile = (inner, rx) => `<rect width="100" height="100" rx="${rx}" fill="${T.charcoal}"/>${inner}`;
const inset = (inner, pct) => `<g transform="translate(50 50) scale(${pct}) translate(-50 -50)">${inner}</g>`;

const T = {
  charcoal: '#17191c', offwhite: '#f4f7fb',
  mutedOnLight: '#666666', mutedOnDark: '#9c9ea2',
  resumeInk: '#414141', resumeGrey: '#999999',
};

const files = {
  'jshvn-mark-on-light.svg':        svg(mark(T.charcoal, T.mutedOnLight), 'Josh Vaughen'),
  'jshvn-mark-on-dark.svg':         svg(mark(T.offwhite, T.mutedOnDark), 'Josh Vaughen'),
  'jshvn-mark-solid-on-light.svg':  svg(solid(T.charcoal), 'Josh Vaughen'),
  'jshvn-mark-solid-on-dark.svg':   svg(solid(T.offwhite), 'Josh Vaughen'),
  'jshvn-mark-resume.svg':          svg(mark(T.resumeInk, T.resumeGrey), 'Josh Vaughen'),
  // containers: the mark in a charcoal tile
  'jshvn-icon.svg':                 svg(tile(mark(T.offwhite, T.mutedOnDark), 22), 'Josh Vaughen'),
  'jshvn-icon-square.svg':          svg(tile(mark(T.offwhite, T.mutedOnDark), 0), 'Josh Vaughen'),
  'jshvn-icon-circle.svg':          svg(tile(inset(mark(T.offwhite, T.mutedOnDark), 0.74), 50), 'Josh Vaughen'),
  'jshvn-icon-maskable.svg':        svg(tile(inset(mark(T.offwhite, T.mutedOnDark), 0.74), 0), 'Josh Vaughen'),
  // the solid form in the tile, for 16 and 32px favicons where the grey does not survive
  'jshvn-icon-solid.svg':           svg(tile(solid(T.offwhite), 22), 'Josh Vaughen'),
  // single-color mask for Safari pinned tabs; Safari supplies the color
  'safari-pinned-tab.svg':          svg(solid('#000000'), 'Josh Vaughen'),
};

// output directory from argv, default the repo's mark/
const out = process.argv[2] ?? fileURLToPath(new URL('../mark', import.meta.url));
mkdirSync(out, { recursive: true });
for (const [name, svgText] of Object.entries(files)) writeFileSync(join(out, name), svgText);
console.log(`wrote ${Object.keys(files).length} SVGs to ${out}/`);
