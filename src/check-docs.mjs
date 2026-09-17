// Fails when README.md or the index page names a file that is not in the tree, or links a
// heading that is not there. Prose about files is the first thing to rot. Run: task check:docs.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = fileURLToPath(new URL('..', import.meta.url));
const read = f => readFileSync(new URL(f, new URL('..', import.meta.url)), 'utf8');
const SCRATCH = /^(\.git|\.build|public|node_modules)([/\\]|$)/;
const files = readdirSync(repo, { recursive: true, withFileTypes: true })
  .filter(e => e.isFile())
  .map(e => relative(repo, join(e.parentPath, e.name)))
  .filter(p => !SCRATCH.test(p));
const paths = new Set(files);
const names = new Set(files.map(p => p.split('/').pop()));

// Files a recipe tells someone to make on their own site, which are not ours to hold.
const THEIRS = new Set(['site.webmanifest']);
const ASSET = /\.(svg|png|jpg|ico|pdf|woff2|css|mjs|yml|md|txt|sh|html)$/;
const problems = [];

// A path as the docs write it: absolute on the origin, or prefixed by the consumer's own tree.
const repoPath = ref => ref.replace(/^https:\/\/brand\.ijosh\.com\//, '').replace(/^\/+/, '').replace(/^brand\//, '');

const check = (where, ref) => {
  const path = repoPath(ref);
  // A command, or the bare extension that stands for the file beside the one just named.
  if (/\s/.test(path) || path.startsWith('.')) return;
  if (!ASSET.test(path) || THEIRS.has(path.split('/').pop())) return;
  // A bare file name means the file itself, wherever it lives; a path means that exact path.
  const where_to_look = path.includes('/') ? paths : names;
  const found = path.includes('*')
    ? [...where_to_look].some(p => new RegExp(`^${path.replaceAll('.', '\\.').replaceAll('*', '[^/]*')}$`).test(p))
    : where_to_look.has(path);
  if (!found) problems.push(`${where} names ${ref}, which is not in the tree`);
};

// README: every inline-code span and every link to the origin.
const readme = read('README.md');
for (const [, code] of readme.matchAll(/`([^`\n]+)`/g)) check('README.md', code);
for (const [, url] of readme.matchAll(/(https:\/\/brand\.ijosh\.com\/[^\s)"']+)/g)) check('README.md', url);

// README: every anchor link, against the headings as GitHub slugs them.
const slugs = new Set(
  [...readme.matchAll(/^#+ (.+)$/gm)].map(([, title]) =>
    title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')),
);
for (const [, anchor] of readme.matchAll(/\]\(#([^)]+)\)/g)) {
  if (!slugs.has(anchor)) problems.push(`README.md links #${anchor}, which is not a heading`);
}

// The index page is hand-written beside generated files, so every asset it points at must exist.
const index = read('site/index.html');
for (const [, ref] of index.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) {
  if (ref.startsWith('/') || ref.startsWith('https://brand.ijosh.com/')) check('site/index.html', ref);
}

if (problems.length) {
  for (const p of problems) console.error(p);
  process.exit(1);
}
console.log(`check:docs: every file and heading README.md and site/index.html name is there`);
