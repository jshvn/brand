// Writes what the generators produce. They are pure -- each exports the files it stands
// for and writes nothing -- so this is the only place that knows where output goes, and
// importing any of them has no effect on the tree.
//
// The rasterizing, the PDFs and the photo ladder stay in src/build.sh, which has
// rsvg-convert and ImageMagick to hand. This only puts the generated text on disk.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { files as marks } from './marks.mjs';
import { files as banners } from './social.mjs';
import { css as tokens } from './tokens.mjs';

// the tree to write into, from argv, default the repository root
const root = process.argv[2] ?? fileURLToPath(new URL('..', import.meta.url));

const dir = (name, files) => {
  const out = join(root, name);
  mkdirSync(out, { recursive: true });
  for (const [file, content] of Object.entries(files)) writeFileSync(join(out, file), content);
  return `${Object.keys(files).length} in ${name}/`;
};

const written = [dir('mark', marks), dir('social', banners)];
writeFileSync(join(root, 'tokens.css'), tokens);
written.push('tokens.css');
console.log(`generated ${written.join(', ')}`);
