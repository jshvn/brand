// The share image: the picture a link to ijosh.com unfurls with, in a feed, in Slack,
// in a message. The photo takes the left square and the mark signs the charcoal beside
// it -- both halves of the identity at once, which is what a surface this large is for.
// See "Mark or photo" in README.md.
//
// The photo is not drawn here. This is the charcoal half; src/build.sh composites the
// photo master onto the square before writing the JPEG, and the SVG does not survive
// that, so nothing is left serving half a picture.
import { strict as assert } from 'node:assert';
import { mark, GRID, NAME, T } from './marks.mjs';

// 1200x630 is the size every consumer of an og:image asks for. The photo master is
// square, so it takes 630 of the 1200 and the mark gets the 570 that remain.
const W = 1200;
const H = 630;
const SEAM = H; // the photo is square, so the seam falls one canvas height in

// The mark's drawn width. At 170 it leaves 140px between its clear space and the seam
// and the same again to the right edge, so it sits in the middle of its own half
// rather than reading as pushed against one side of it.
const INK = 170;

const s = INK / (2 * GRID.pitch + GRID.cell);
const clear = GRID.pitch * s; // the clear space the rules require: one cell, every side
const box = (GRID.box / 2) * s; // half the box the mark is drawn in
const cx = (SEAM + W) / 2;
const cy = H / 2;

// A fractional length would put soft edges on a mark this regular, so the scale has to
// keep them all whole. That constrains what INK may be, and the constraint falls out of
// the mark's own numbers rather than being written down beside them.
for (const v of [s * GRID.cell, s * GRID.radius, clear, box, cx, cy]) {
  assert(Number.isInteger(v), `${v} is not a whole pixel`);
}

// The mark may not cross the seam, and neither may its clear space: a mark keyed over a
// photograph is the one thing the rules forbid outright.
const reach = INK / 2 + clear;
assert(cx - reach >= SEAM, 'the mark or its clear space reaches onto the photo');
assert(
  cx + reach <= W && cy - reach >= 0 && cy + reach <= H,
  'the mark or its clear space leaves the canvas',
);

export const files = {
  'jshvn-share.svg':
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" ` +
    `viewBox="0 0 ${W} ${H}" role="img" aria-label="${NAME}">` +
    `<rect width="${W}" height="${H}" fill="${T.charcoal}"/>` +
    `<g transform="translate(${cx - box} ${cy - box}) scale(${s})">` +
    `${mark(T.offwhite, T.mutedOnDark)}</g></svg>\n`,
};
