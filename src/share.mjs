// The og:image for ijosh.com: the photo in the left square, the mark on charcoal beside it.
// Only the charcoal half is drawn here; src/build.mjs composites the photo onto it.
import { GRID, scaled, within, canvas } from './marks.mjs';

// 1200x630 is what every og:image consumer asks for. The photo is square, so it takes 630.
const W = 1200;
const H = 630;

// The mark's drawn width. 170 leaves 140px on either side of its clear space.
const INK = 170;

const s = INK / (2 * GRID.pitch + GRID.cell);
const g = scaled(s);
const cx = (H + W) / 2;
const cy = H / 2;

// Neither the mark nor its clear space may cross the seam onto the photo, or leave the canvas.
within(cx, cy, g.half + g.clear, [H, 0, W, H], 'the mark or its clear space leaves the charcoal half');

export const share = { w: W, h: H, svg: canvas(W, H, cx, cy, s) };
