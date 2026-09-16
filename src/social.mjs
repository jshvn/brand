// The social banners: one per platform, each at the pixel size that platform asks for.
// A banner is a charcoal field of the mark's own grid, extended -- GRID scaled up and
// registered so the mark's nine grid positions land on lattice positions. The mark is
// not set on a pattern; it is the lattice, lit. Each cell of the field takes one of four
// tones, chosen by a hash of where that cell is, so the field reads as scattered without
// being random: the same cell is the same tone in every build, on every machine.
//
// A 5x5 block of lattice positions is suppressed around the mark. That is the one-cell
// clear space the rules require, and it is also what keeps faint cells out of the two
// empty positions inside the mark's own 3x3, where they would read as cells added to
// the mark.
//
// The avatar beside a profile banner is the photo, so the banner is the mark: see
// "Mark or photo" in README.md. GitHub's repo social preview is the same field with
// nothing to place around -- no avatar, no name, so the mark sits dead centre.
import { strict as assert } from 'node:assert';
import { mark, GRID, NAME, T } from './marks.mjs';

// pitch is picked so the mark's ink lands near a third of the canvas height and the
// lattice runs about nine rows. at: the mark's centre, as a fraction of the canvas.
// safe: [x0, y0, x1, y1], the region the platform neither crops nor covers with the
// avatar and the name set beside it. Every number here is what the platform documents
// or what its own layout forces; none of it is taste.
const PLATFORMS = {
  // mobile re-crops to the centre 560px of the 851, and the avatar sits bottom-centre
  // there, so this one is centred horizontally and cannot be offset off the avatar
  facebook: { w: 851, h: 315, pitch: 36, at: [0.50, 0.45], safe: [145.5, 0, 705.5, 315] },
  // avatar bottom-left; mobile keeps the centre 1260x300
  linkedin: { w: 1584, h: 396, pitch: 48, at: [0.65, 0.45], safe: [162, 48, 1422, 348] },
  // avatar bottom-left, the name and bio overlay the bottom on mobile, and the top and
  // bottom edges may crop -- so the mark rides higher here than on the other two
  x: { w: 1500, h: 500, pitch: 60, at: [0.65, 0.40], safe: [300, 50, 1500, 350] },
  // GitHub's repo social preview, which is not a profile banner -- GitHub has none.
  // Nothing overlays it, but a repo link unfurls at 1.91:1 on LinkedIn and in Slack,
  // and that crop takes the sides, so the safe region is the centre it leaves.
  github: {
    w: 1280, h: 640, pitch: 72, at: [0.50, 0.50], safe: [64, 0, 1216, 640],
    file: 'jshvn-social-preview',
  },
};

// The field's own four tones, in a ramp that steps evenly once laid on the charcoal.
// They are deliberately not the mark's pair and not the print greys: a shade on charcoal
// is a different job from ink on paper, and a name meaning "survives a photocopier" must
// not quietly come to mean "one of the squares". The brightest is the off-white the mark
// is drawn in, so the field and the mark agree at the top of the range and part below it.
const FIELD = [T.offwhite, '#a8adb5', '#767b82', '#4a4f56'];

// At this strength the four land about six of 255 apart per channel: separate enough to
// read as a grain, and a big enough step to survive the recompression every platform
// applies to an upload.
const FIELD_OPACITY = 0.1;

// Which tone a cell takes is a hash of where the cell is, not a draw from a generator.
// There is no seed and no state, so it does not depend on the order cells are drawn:
// add a cell and every other cell keeps the tone it had. The field reads as scattered
// and rebuilds byte-identical forever, which is what task check needs of it.
const shade = (i, j) => {
  let h = Math.imul(i + 0x9e37, 374761393) ^ Math.imul(j + 0x85eb, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return FIELD[((h ^ (h >>> 16)) >>> 0) % FIELD.length];
};

// Every length is the mark's own, scaled by s, so nothing about the grid is restated
// here. A fractional length would put soft edges on a lattice this regular, so the
// scale has to keep them all whole -- which constrains what pitch a new platform may
// use. That constraint falls out of the mark's own numbers and shifts when they do, so
// it is asserted rather than written down: with today's grid it means a multiple of 12.
// s itself is a transform, not a coordinate, and is free to be fractional.
const geometry = ({ w, h, pitch, at }) => {
  const s = pitch / GRID.pitch;
  const g = {
    s,
    cx: Math.round(w * at[0]),
    cy: Math.round(h * at[1]),
    cell: GRID.cell * s,
    rx: GRID.radius * s,
    half: ((2 * GRID.pitch + GRID.cell) / 2) * s, // half the mark's 3x3 span
    clear: GRID.pitch * s, // the clear space the rules require: one cell, on every side
    box: (GRID.box / 2) * s, // half the box the mark is drawn in
  };
  for (const [k, v] of Object.entries(g)) {
    if (k !== 's') assert(Number.isInteger(v), `${k} is ${v}, not a whole pixel`);
  }
  return g;
};

// Lattice positions on one axis, registered to the mark's first cell and running past
// both ends of the canvas so the field bleeds off every edge rather than stopping.
const axis = (centre, { half, cell }, pitch, limit) => {
  const first = centre - half;
  const out = [];
  for (let v = first + Math.ceil((-cell - first) / pitch) * pitch; v < limit; v += pitch) out.push(v);
  return out;
};

const banner = (p) => {
  const g = geometry(p);
  const reach = g.half + g.clear; // from the mark's centre to the far side of its clear space
  const field = [];
  for (const x of axis(g.cx, g, p.pitch, p.w)) {
    for (const y of axis(g.cy, g, p.pitch, p.h)) {
      // the cell's position on the lattice, signed, so the field is not mirrored
      const i = Math.round((x + g.cell / 2 - g.cx) / p.pitch);
      const j = Math.round((y + g.cell / 2 - g.cy) / p.pitch);
      // The 5x5 of lattice positions centred on the mark is its 3x3 plus one ring of
      // clear space. Nothing is drawn there; the mark's own cells are drawn last.
      if (Math.abs(i) <= 2 && Math.abs(j) <= 2) continue;
      const dx = Math.abs(x + g.cell / 2 - g.cx);
      const dy = Math.abs(y + g.cell / 2 - g.cy);
      // What survives is measured against the rule rather than against the line above,
      // so a wrong suppression is caught here instead of agreeing with itself.
      assert(
        !(dx < reach + g.cell / 2 && dy < reach + g.cell / 2),
        'field cell intrudes on the clear space',
      );
      field.push(
        `<rect x="${x}" y="${y}" width="${g.cell}" height="${g.cell}" rx="${g.rx}" fill="${shade(i, j)}"/>`,
      );
    }
  }
  const [x0, y0, x1, y1] = p.safe;
  assert(
    g.cx - reach >= x0 && g.cx + reach <= x1 && g.cy - reach >= y0 && g.cy + reach <= y1,
    'the mark and its clear space leave the safe zone',
  );
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${p.w}" height="${p.h}" ` +
    `viewBox="0 0 ${p.w} ${p.h}" role="img" aria-label="${NAME}">` +
    `<rect width="${p.w}" height="${p.h}" fill="${T.charcoal}"/>` +
    `<g opacity="${FIELD_OPACITY}">${field.join('')}</g>` +
    `<g transform="translate(${g.cx - g.box} ${g.cy - g.box}) scale(${g.s})">` +
    `${mark(T.offwhite, T.mutedOnDark)}</g></svg>\n`
  );
};

// Each file is named for its platform, except where the platform has a name of its own
// for the thing: GitHub calls it a social preview, and nobody calls it a banner.
export const files = Object.fromEntries(
  Object.entries(PLATFORMS).map(([name, p]) => [`${p.file ?? `jshvn-banner-${name}`}.svg`, banner(p)]),
);
