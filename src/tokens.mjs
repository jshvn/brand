// The palette and the type: every color the mark and ijosh.com paint, and every face.
// Generates tokens.css, which the site imports.

// The mark's tones, as src/marks.mjs paints them.
export const T = {
  charcoal: '#17191c', offwhite: '#f4f7fb',
  mutedOnLight: '#666666', mutedOnDark: '#9c9ea2',
  resumeInk: '#414141', resumeGrey: '#999999',
};

// The banner field's tones, an even ramp on charcoal. The brightest is the mark's own off-white.
export const FIELD = [T.offwhite, '#a8adb5', '#767b82', '#4a4f56'];

// The dark surface is the icon tile's charcoal and the dark text the mark's off-white.
const SITE = {
  light: {
    '--bg': '#ffffff',
    '--text': '#333333',
    '--icon': '#000000',
    '--text-muted': '#6b7280',
    '--text-body': '#4b5563',
    '--accent': '#ca486d',
    '--btn-bg': '#1c1c1c',
    '--btn-fg': '#ffffff',
  },
  dark: {
    '--bg': T.charcoal,
    '--text': T.offwhite,
    '--icon': T.offwhite,
    '--text-muted': '#9aa7b4',
    '--text-body': '#c6d0da',
    '--accent': '#e98aa3',
    '--btn-bg': T.offwhite,
    '--btn-fg': '#14171c',
  },
};

const MARK = {
  light: { '--mark': T.charcoal, '--mark-muted': T.mutedOnLight },
  dark: { '--mark': T.offwhite, '--mark-muted': T.mutedOnDark },
};

// A pill is the text color at a tenth over the page, so it needs no value of its own.
const PILL = { light: ['#333333', 0.1], dark: ['#ffffff', 0.1] };
const rgba = ([hex, a]) => `rgba(${channels(hex).join(', ')}, ${a})`;
const overlay = ([hex, a], bg) =>
  '#' + channels(hex).map((c, i) => Math.round(a * c + (1 - a) * channels(bg)[i]).toString(16).padStart(2, '0')).join('');

// Contrast, as WCAG 2 defines it: relative luminance, lighter over darker.
const channels = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const luminance = hex =>
  channels(hex)
    .map(c => c / 255)
    .map(c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((sum, c, i) => sum + [0.2126, 0.7152, 0.0722][i] * c, 0);
export const contrast = (fg, bg) => {
  const [light, dark] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
};

// What every scheme owes its reader: AA is 4.5 for text and 3 for a graphic. src/build.mjs asserts it.
export const contrastPairs = Object.keys(SITE).flatMap(name => {
  const c = SITE[name];
  const pill = overlay(PILL[name], c['--bg']);
  return [
    [`${name}: a heading on the page`, c['--text'], c['--bg'], 4.5],
    [`${name}: running text on the page`, c['--text-body'], c['--bg'], 4.5],
    [`${name}: muted text on the page`, c['--text-muted'], c['--bg'], 4.5],
    [`${name}: a link on the page`, c['--accent'], c['--bg'], 4.5],
    [`${name}: a pill's text`, c['--text'], pill, 4.5],
    [`${name}: a button's label`, c['--btn-fg'], c['--btn-bg'], 4.5],
    [`${name}: an icon on the page`, c['--icon'], c['--bg'], 3],
    [`${name}: the mark on the page`, MARK[name]['--mark'], c['--bg'], 3],
    [`${name}: the mark's end cells`, MARK[name]['--mark-muted'], c['--bg'], 3],
  ];
});

// Google's latin and latin-ext subsets. A browser fetches a file only for characters on the page.
const LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const LATIN_EXT = 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF';

// One weight per face, and only these ship. The Montserrat file is variable, but declared at 600
// it renders 600 whatever weight is asked for. Graduate has no latin-ext cut.
export const FACES = [
  { family: 'Montserrat', weight: 600, subsets: { 'latin-ext': LATIN_EXT, latin: LATIN } },
  { family: 'Graduate', weight: 400, subsets: { latin: LATIN } },
  { family: 'PT Serif', weight: 400, subsets: { 'latin-ext': LATIN_EXT, latin: LATIN } },
];

// The file a face's subset lives in, under fonts/.
export const fontFile = (family, weight, subset) =>
  `${family.toLowerCase().replace(/ /g, '-')}-${weight}-${subset}.woff2`;

// The roles, one face each. See "Typography" in README.md.
const TYPE = {
  '--font-display': '"Montserrat", sans-serif',
  '--font-display-weight': '600',
  '--font-label': '"Graduate", serif',
  '--font-label-tracking': '0.28em',
  '--font-text': '"PT Serif", Georgia, serif',
  '--font-text-leading': '1.4',
};

// Root-relative, so tokens.css and fonts/ copied to any site root keep working.
const faces = FACES.flatMap(({ family, weight, subsets }) =>
  Object.entries(subsets).map(([subset, range]) => `@font-face {
  font-family: "${family}";
  font-weight: ${weight};
  font-display: swap;
  src: url(/fonts/${fontFile(family, weight, subset)}) format("woff2");
  unicode-range: ${range};
}`),
).join('\n');

const vars = (obj, pad) =>
  Object.entries(obj)
    .map(([k, v]) => `${pad}${k}: ${v};`)
    .join('\n');

const scheme = (name, pad) =>
  [
    `${pad}color-scheme: ${name};`,
    vars({ ...SITE[name], '--pill-bg': rgba(PILL[name]) }, pad),
    `${pad}/* the mark on a ${name} surface */`,
    vars(MARK[name], pad),
  ].join('\n');

export const css = `/* The palette and type for ijosh.com. Generated by src/tokens.mjs: run \`task build\`, do not edit.
   Serve fonts/ at /fonts/ beside it. Set data-theme="light" or "dark" on <html> to override
   the system preference. */
${faces}

:root {
${vars(TYPE, '  ')}
${scheme('light', '  ')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${scheme('dark', '    ')}
  }
}

:root[data-theme="dark"] {
${scheme('dark', '  ')}
}
`;
