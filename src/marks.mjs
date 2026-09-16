// The mark, drawn from a 3x3 grid in two forms: two-tone (serif and hook muted) and solid.
// Everything in mark/, and the canvases social.mjs and share.mjs place it on, come from here.
import { strict as assert } from 'node:assert';
import { T } from './tokens.mjs';

// The only place the grid's numbers live. The drawing fills 16 to 84 of the 100 box.
export const GRID = {
  box: 100, // the viewBox the mark is drawn in
  origin: 16, // the first cell's edge
  pitch: 24, // cell to cell
  cell: 20, // the cell itself
  radius: 4, // its corner, which is also the gap between cells
};

// The mark's accessible name everywhere it is drawn. Never "logo".
export const NAME = 'Josh Vaughen';

const P = [0, 1, 2].map(i => GRID.origin + i * GRID.pitch);
const rect = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${GRID.radius}" fill="${fill}"/>`;
const cell = (cx, cy, fill) => rect(P[cx], P[cy], GRID.cell, GRID.cell, fill);
const bar = (cx0, cy0, cx1, cy1, fill) => rect(P[cx0], P[cy0], P[cx1] - P[cx0] + GRID.cell, P[cy1] - P[cy0] + GRID.cell, fill);

// stem, base, hook block, then the two muted end cells: top serif and hook tail
const body = fg => bar(2, 0, 2, 2, fg) + bar(1, 2, 2, 2, fg) + cell(0, 2, fg);
const mark = (fg, muted) => body(fg) + cell(0, 1, muted) + cell(1, 0, muted);
const solid = fg => mark(fg, fg);
const onDark = mark(T.offwhite, T.mutedOnDark);

// Container proportions, which are not the mark's grid.
const TILE_RADIUS = 22; // percent of the tile, for the rounded app icon
const INSET = 0.74; // the mark's share of a circle or maskable square

const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID.box} ${GRID.box}" role="img" aria-label="${NAME}">${inner}</svg>\n`;
const tile = (inner, rx) => `<rect width="${GRID.box}" height="${GRID.box}" rx="${rx}" fill="${T.charcoal}"/>${inner}`;
const mid = GRID.box / 2;
const inset = (inner, pct) => `<g transform="translate(${mid} ${mid}) scale(${pct}) translate(${-mid} ${-mid})">${inner}</g>`;

export const files = {
  'jshvn-mark-on-light.svg':        svg(mark(T.charcoal, T.mutedOnLight)),
  'jshvn-mark-on-dark.svg':         svg(onDark),
  'jshvn-mark-solid-on-light.svg':  svg(solid(T.charcoal)),
  'jshvn-mark-solid-on-dark.svg':   svg(solid(T.offwhite)),
  'jshvn-mark-resume.svg':          svg(mark(T.resumeInk, T.resumeGrey)),
  'jshvn-mark-solid-resume.svg':    svg(solid(T.resumeInk)),
  // containers: the mark in a charcoal tile
  'jshvn-icon.svg':                 svg(tile(onDark, TILE_RADIUS)),
  'jshvn-icon-square.svg':          svg(tile(onDark, 0)),
  'jshvn-icon-circle.svg':          svg(tile(inset(onDark, INSET), mid)),
  'jshvn-icon-maskable.svg':        svg(tile(inset(onDark, INSET), 0)),
  // solid form for 16 and 32px favicons, where the grey drops out
  'jshvn-icon-solid.svg':           svg(tile(solid(T.offwhite), TILE_RADIUS)),
  // Safari pinned-tab mask; Safari supplies the color
  'safari-pinned-tab.svg':          svg(solid('#000000')),
};

// Placing the mark on a larger canvas. Every length must land on a whole pixel, or the edges go soft.
const whole = lengths => {
  for (const [k, v] of Object.entries(lengths)) assert(Number.isInteger(v), `${k} is ${v}, not a whole pixel`);
};

// The mark's lengths at scale s: its cell and corner, half its 3x3 span, one cell of clear space, half its box.
export const scaled = s => {
  const g = {
    cell: GRID.cell * s,
    rx: GRID.radius * s,
    half: ((2 * GRID.pitch + GRID.cell) / 2) * s,
    clear: GRID.pitch * s,
    box: (GRID.box / 2) * s,
  };
  whole(g);
  return g;
};

// Asserts a square of the given reach around (cx, cy) stays inside [x0, y0, x1, y1].
export const within = (cx, cy, reach, [x0, y0, x1, y1], message) =>
  assert(cx - reach >= x0 && cx + reach <= x1 && cy - reach >= y0 && cy + reach <= y1, message);

// A charcoal canvas with the mark on dark centred at (cx, cy) at scale s, over any layer given.
export const canvas = (w, h, cx, cy, s, under = '') => {
  whole({ cx, cy });
  const box = (GRID.box / 2) * s;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" ` +
    `viewBox="0 0 ${w} ${h}" role="img" aria-label="${NAME}">` +
    `<rect width="${w}" height="${h}" fill="${T.charcoal}"/>${under}` +
    `<g transform="translate(${cx - box} ${cy - box}) scale(${s})">${onDark}</g></svg>\n`
  );
};
