// Builds every committed asset into argv[2], default the repo root: the SVGs and tokens.css,
// then the PNGs, ICO, PDFs, photo ladder and share image. Runs inside the toolbox image.
import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { files as marks } from './marks.mjs';
import { banners } from './social.mjs';
import { share } from './share.mjs';
import { contrast, contrastPairs, css, FACES, fontFile } from './tokens.mjs';

process.env.SOURCE_DATE_EPOCH = '0'; // cairo stamps PDFs with the wall clock otherwise
const repo = fileURLToPath(new URL('..', import.meta.url));
const root = process.argv[2] ?? repo;
const at = (...p) => join(root, ...p);
const master = join(repo, 'photo', 'profile.png');

const run = (cmd, args, input) =>
  execFileSync(cmd, args, { input, stdio: [input ? 'pipe' : 'ignore', 'inherit', 'inherit'] });
const rsvg = (svg, out, ...opts) => run('rsvg-convert', [...opts, '-o', out, svg]);
const png = (svg, out, px) => rsvg(at('mark', `${svg}.svg`), at('mark', out), '-w', `${px}`, '-h', `${px}`);
const jpeg = (args, out, input) => run('magick', [...args, '-strip', '-quality', '85', out], input);

for (const d of ['mark', 'social', 'share', 'photo']) mkdirSync(at(d), { recursive: true });
for (const [file, svg] of Object.entries(marks)) writeFileSync(at('mark', file), svg);
writeFileSync(at('tokens.css'), css);

// fonts/ is committed by hand, not built: it must hold exactly the files tokens.css names, and the license.
const named = FACES.flatMap(f => Object.keys(f.subsets).map(sub => fontFile(f.family, f.weight, sub)));
assert.deepEqual(readdirSync(join(repo, 'fonts')).sort(), [...named, 'OFL.txt'].sort(), 'fonts/ and tokens.css disagree');

// No palette edit ships below WCAG AA. A pair that has to be an exception does not belong in the palette.
for (const [what, fg, bg, min] of contrastPairs) {
  const ratio = contrast(fg, bg);
  assert(ratio >= min, `${what}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1, under ${min}:1`);
}

const SIZES = {
  'jshvn-mark-on-light': [1024, 512], 'jshvn-mark-on-dark': [1024, 512],
  'jshvn-mark-solid-on-light': [512], 'jshvn-mark-solid-on-dark': [512],
  'jshvn-icon': [1024, 512], 'jshvn-icon-square': [512],
  'jshvn-icon-maskable': [192, 512], 'jshvn-icon-circle': [1024],
};
for (const [svg, sizes] of Object.entries(SIZES)) for (const px of sizes) png(svg, `${svg}-${px}.png`, px);
png('jshvn-icon-square', 'apple-touch-icon-180.png', 180);

// favicon.ico: the solid tile at 16 and 32, the two-tone tile at 48
const tmp = mkdtempSync(join(tmpdir(), 'brand-'));
const ico = [[16, 'jshvn-icon-solid'], [32, 'jshvn-icon-solid'], [48, 'jshvn-icon']].map(([px, svg]) => {
  const out = join(tmp, `favicon-${px}.png`);
  rsvg(at('mark', `${svg}.svg`), out, '-w', `${px}`, '-h', `${px}`);
  return out;
});
run('magick', [...ico, at('mark', 'favicon.ico')]);
rmSync(tmp, { recursive: true });

// A PDF of every mark form, for LaTeX and print. Containers get none: a tile is a screen surface.
for (const form of ['on-light', 'on-dark', 'solid-on-light', 'solid-on-dark', 'resume', 'solid-resume']) {
  rsvg(at('mark', `jshvn-mark-${form}.svg`), at('mark', `jshvn-mark-${form}.pdf`), '-f', 'pdf');
}

// social/: each PNG named for its pixel size, the number an upload form asks for
for (const { file, w, h, svg } of banners) {
  writeFileSync(at('social', `${file}.svg`), svg);
  rsvg(at('social', `${file}.svg`), at('social', `${file}-${w}x${h}.png`));
}

// photo/: the ladder from the master. Upload forms cap pixel or byte size, so the rungs give a choice under both.
if (resolve(root) !== resolve(repo)) cpSync(master, at('photo', 'profile.png'));
for (const px of [1024, 512, 400, 256, 128, 64]) jpeg([master, '-resize', `${px}x${px}`], at('photo', `profile-${px}.jpg`));

// share/: the photo composited onto the charcoal half. JPEG keeps it under a megabyte.
const half = execFileSync('rsvg-convert', [], { input: share.svg });
jpeg(
  ['png:-', '(', master, '-resize', `${share.h}x${share.h}`, ')', '-geometry', '+0+0', '-composite'],
  at('share', `jshvn-share-${share.w}x${share.h}.jpg`),
  half,
);

const n = d => readdirSync(at(d)).length;
console.log(`built ${n('mark')} in mark/, ${n('social')} in social/, ${n('share')} in share/, ${n('photo')} in photo/, and tokens.css`);
