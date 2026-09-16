// One banner per platform: a charcoal field of the mark's own grid, scaled up, with the
// mark lit on the lattice. See "Mark or photo" in README.md.
import { strict as assert } from 'node:assert';
import { GRID, scaled, within, canvas } from './marks.mjs';
import { FIELD } from './tokens.mjs';

// pitch: lattice spacing in px. at: the mark's centre as a fraction of the canvas.
// safe: [x0, y0, x1, y1], what the platform neither crops nor covers with the avatar.
const PLATFORMS = {
  // mobile crops to the centre 560px with the avatar bottom-centre, so the mark stays centred
  facebook: { w: 851, h: 315, pitch: 36, at: [0.50, 0.45], safe: [145.5, 0, 705.5, 315] },
  // avatar bottom-left; mobile keeps the centre 1260x300
  linkedin: { w: 1584, h: 396, pitch: 48, at: [0.65, 0.45], safe: [162, 48, 1422, 348] },
  // avatar bottom-left; name and bio overlay the bottom on mobile, top and bottom may crop
  x: { w: 1500, h: 500, pitch: 60, at: [0.65, 0.40], safe: [300, 50, 1500, 350] },
  // 17:6 at twice Discord's 680x240 minimum. Avatar over the bottom-left 42% and the status
  // bubble along the bottom; the profile view trims about 5% per side. Pitch 60 keeps the
  // mark above 32px in the 300px popout.
  discord: { w: 1360, h: 480, pitch: 60, at: [0.65, 0.45], safe: [578, 48, 1292, 408] },
  // 3:1 in a 150px strip, cover-fit: the 600px web column trims 62.5 top and bottom, a 360px
  // phone trims 150 per side. The avatar covers display x 10-104, y 104-150, so x < 497 below.
  bluesky: { w: 1500, h: 500, pitch: 60, at: [0.65, 0.45], safe: [497, 62.5, 1350, 437.5] },
  // GitHub's repo social preview. Link unfurls crop to 1.91:1, so the safe region is the centre.
  github: {
    w: 1280, h: 640, pitch: 72, at: [0.50, 0.50], safe: [64, 0, 1216, 640],
    file: 'jshvn-social-preview',
  },
};

// About six of 255 per channel between tones: reads as grain, survives platform recompression.
const FIELD_OPACITY = 0.1;

// A cell's tone is a hash of its lattice position, so the field rebuilds byte-identical.
const shade = (i, j) => {
  let h = Math.imul(i + 0x9e37, 374761393) ^ Math.imul(j + 0x85eb, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return FIELD[((h ^ (h >>> 16)) >>> 0) % FIELD.length];
};

// Lattice positions on one axis from the mark's first cell at `first`, bleeding past both edges.
const axis = (first, cell, pitch, limit) => {
  const out = [];
  for (let v = first + Math.ceil((-cell - first) / pitch) * pitch; v < limit; v += pitch) out.push(v);
  return out;
};

// pitch must keep every scaled length whole: a multiple of 12 with today's grid.
const banner = (p) => {
  const s = p.pitch / GRID.pitch;
  const g = scaled(s);
  const cx = Math.round(p.w * p.at[0]);
  const cy = Math.round(p.h * p.at[1]);
  const reach = g.half + g.clear; // mark centre to the far side of its clear space
  const field = [];
  for (const x of axis(cx - g.half, g.cell, p.pitch, p.w)) {
    for (const y of axis(cy - g.half, g.cell, p.pitch, p.h)) {
      // signed lattice position, so the field is not mirrored
      const i = Math.round((x + g.cell / 2 - cx) / p.pitch);
      const j = Math.round((y + g.cell / 2 - cy) / p.pitch);
      // skip the 5x5 around the mark: its 3x3 plus one ring of clear space
      if (Math.abs(i) <= 2 && Math.abs(j) <= 2) continue;
      const dx = Math.abs(x + g.cell / 2 - cx);
      const dy = Math.abs(y + g.cell / 2 - cy);
      // checked against the rule, not against the skip above
      assert(
        !(dx < reach + g.cell / 2 && dy < reach + g.cell / 2),
        'field cell intrudes on the clear space',
      );
      field.push(
        `<rect x="${x}" y="${y}" width="${g.cell}" height="${g.cell}" rx="${g.rx}" fill="${shade(i, j)}"/>`,
      );
    }
  }
  within(cx, cy, reach, p.safe, 'the mark and its clear space leave the safe zone');
  return canvas(p.w, p.h, cx, cy, s, `<g opacity="${FIELD_OPACITY}">${field.join('')}</g>`);
};

// Named for the platform, unless the platform names it (GitHub: social preview).
export const banners = Object.entries(PLATFORMS).map(([name, p]) => ({
  file: p.file ?? `jshvn-banner-${name}`, w: p.w, h: p.h, svg: banner(p),
}));
