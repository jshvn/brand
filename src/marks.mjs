// The mark, drawn from a 3x3 grid. Two forms: the mark (two tones, the serif and the
// hook muted) and the solid mark (one tone). Everything in mark/ is generated from here,
// and src/social.mjs builds the banners from the same grid, the same drawing and the
// same tones rather than restating any of them.
// The grid the mark is measured in, and the only place these numbers are stated. The
// drawing fills origin to box-origin, so 16 to 84 of the 100, which is why an
// includegraphics height sets the box and not the drawing -- see the resume recipe.
export const GRID = {
  box: 100, // the viewBox the mark is drawn in
  origin: 16, // the first cell's edge
  pitch: 24, // cell to cell
  cell: 20, // the cell itself
  radius: 4, // its corner, which is also the gap between cells
};

// The name is the mark's accessible name everywhere it is drawn. It is never "logo".
export const NAME = 'Josh Vaughen';

const P = [0, 1, 2].map(i => GRID.origin + i * GRID.pitch);
const rect = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${GRID.radius}" fill="${fill}"/>`;
const cell = (cx, cy, fill) => rect(P[cx], P[cy], GRID.cell, GRID.cell, fill);
const bar = (cx0, cy0, cx1, cy1, fill) => rect(P[cx0], P[cy0], P[cx1] - P[cx0] + GRID.cell, P[cy1] - P[cy0] + GRID.cell, fill);

// stem, base, hook block, then the two end cells: top serif and hook tail
const body = fg => bar(2, 0, 2, 2, fg) + bar(1, 2, 2, 2, fg) + cell(0, 2, fg);
const mark = (fg, muted) => body(fg) + cell(0, 1, muted) + cell(1, 0, muted);
const solid = fg => mark(fg, fg);

// The containers' own proportions, which are not the mark's grid.
const TILE_RADIUS = 22; // percent of the tile, for the rounded app icon
const INSET = 0.74; // the mark's share of a circle, and of a maskable square

const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID.box} ${GRID.box}" role="img" aria-label="${NAME}">${inner}</svg>\n`;
const tile = (inner, rx) => `<rect width="${GRID.box}" height="${GRID.box}" rx="${rx}" fill="${T.charcoal}"/>${inner}`;
const mid = GRID.box / 2;
const inset = (inner, pct) => `<g transform="translate(${mid} ${mid}) scale(${pct}) translate(${-mid} ${-mid})">${inner}</g>`;

const T = {
  charcoal: '#17191c', offwhite: '#f4f7fb',
  mutedOnLight: '#666666', mutedOnDark: '#9c9ea2',
  resumeInk: '#414141', resumeGrey: '#999999',
};

export const files = {
  'jshvn-mark-on-light.svg':        svg(mark(T.charcoal, T.mutedOnLight)),
  'jshvn-mark-on-dark.svg':         svg(mark(T.offwhite, T.mutedOnDark)),
  'jshvn-mark-solid-on-light.svg':  svg(solid(T.charcoal)),
  'jshvn-mark-solid-on-dark.svg':   svg(solid(T.offwhite)),
  'jshvn-mark-resume.svg':          svg(mark(T.resumeInk, T.resumeGrey)),
  'jshvn-mark-solid-resume.svg':    svg(solid(T.resumeInk)),
  // containers: the mark in a charcoal tile
  'jshvn-icon.svg':                 svg(tile(mark(T.offwhite, T.mutedOnDark), TILE_RADIUS)),
  'jshvn-icon-square.svg':          svg(tile(mark(T.offwhite, T.mutedOnDark), 0)),
  'jshvn-icon-circle.svg':          svg(tile(inset(mark(T.offwhite, T.mutedOnDark), INSET), mid)),
  'jshvn-icon-maskable.svg':        svg(tile(inset(mark(T.offwhite, T.mutedOnDark), INSET), 0)),
  // the solid form in the tile, for 16 and 32px favicons where the grey does not survive
  'jshvn-icon-solid.svg':           svg(tile(solid(T.offwhite), TILE_RADIUS)),
  // single-color mask for Safari pinned tabs; Safari supplies the color
  'safari-pinned-tab.svg':          svg(solid('#000000')),
};

export { mark, T };
