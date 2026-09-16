<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="mark/jshvn-mark-on-dark.svg">
    <img src="mark/jshvn-mark-on-light.svg" alt="Josh Vaughen" width="112">
  </picture>
</p>

<h1 align="center">brand</h1>

<p align="center">The mark for Josh Vaughen and ijosh.com, the color palette, and the rules for using them.</p>

This repository is the source of truth for the mark and the palette. Everything in it is
served at [brand.ijosh.com](https://brand.ijosh.com). Other repositories link to those
URLs instead of keeping copies, so a change here is live everywhere within five minutes.

[What's here](#whats-here) - [Where it is served](#where-it-is-served) -
[Using it](#using-it) - [The palette](#the-palette) - [The rules](#the-rules) -
[Building](#building) - [License](#license)

## What's here

The mark is a J on a three by three grid: 24 unit pitch, 20 unit cells, 4 unit gaps and
corner radius, in a 100 unit box. The stem and base are solid bars. The two cells at the
ends of the stroke, the serif at the top and the tip of the tail, are a lighter tone, so
the letter looks drawn with a pen that lifts at each end.

It comes in two forms.

| Form | File | Use |
|---|---|---|
| **Mark** | `jshvn-mark-on-light.svg`, `jshvn-mark-on-dark.svg` | The primary form. Two tones. |
| **Mark, solid** | `jshvn-mark-solid-on-light.svg`, `jshvn-mark-solid-on-dark.svg` | One tone. For anywhere the grey cannot be trusted. |

There are five icon tiles, each a charcoal square holding the on-dark mark.

| Tile | File | Use |
|---|---|---|
| **Icon** | `jshvn-icon.svg` | Rounded, 22% radius. App icons, favicons at 48px and above. |
| **Icon, square** | `jshvn-icon-square.svg` | Square. Apple touch icon; iOS rounds it. |
| **Icon, circle** | `jshvn-icon-circle.svg` | Circle with the mark at 74%. Circular avatars. |
| **Icon, maskable** | `jshvn-icon-maskable.svg` | Square with the mark at 74%. Android maskable icons. |
| **Icon, solid** | `jshvn-icon-solid.svg` | Rounded, with the solid mark. Favicons at 16 and 32px. |

And four wide images: a profile banner for each of three platforms, and the preview
GitHub shows when a repository is linked. Each is at the size its platform asks for.

| Platform | File | Pixels |
|---|---|---|
| **LinkedIn** | `social/jshvn-banner-linkedin-1584x396.png` | 1584 x 396 |
| **Facebook** | `social/jshvn-banner-facebook-851x315.png` | 851 x 315 |
| **X** | `social/jshvn-banner-x-1500x500.png` | 1500 x 500 |
| **GitHub** | `social/jshvn-social-preview-1280x640.png` | 1280 x 640 |

A banner is the mark on a charcoal field patterned with the same grid, aligned so the
mark's nine cells land on grid positions. Each field cell takes one of four grey tones at
10% opacity, chosen by hashing the cell's position. There is no random seed, so the field
looks scattered but every build produces identical output, and `task check` can prove a
rebuild matches the committed files byte for byte.

Upload the PNG. The SVG beside it is the source.

The mark sits in a different place on each. The three profile platforms overlay the
avatar on the bottom left and crop the edges on mobile, and X runs the name and bio along
the bottom, so each mark is placed in the region its platform leaves clear. GitHub
overlays nothing, but a repository link unfurls at 1.91:1, which takes the sides, so that
mark is centred. Those regions are the `safe` entries in `src/social.mjs`, and the
generator errors if a mark and its clear space would fall outside one.

The photo is the other half of the identity. `photo/profile.png` is the master. The JPEGs
beside it are the same crop at smaller sizes, for upload forms that cap pixels or bytes.

| File | Pixels | Weight |
|---|---|---|
| `profile.png` | 1024 | 1.6 MB, the master, lossless |
| `profile-1024.jpg` | 1024 | 126 KB |
| `profile-512.jpg` | 512 | 33 KB |
| `profile-400.jpg` | 400 | 20 KB |
| `profile-256.jpg` | 256 | 9 KB |
| `profile-128.jpg` | 128 | 3 KB |
| `profile-64.jpg` | 64 | 1 KB |

The weights are for the current photo and change when it does. Every JPEG is quality 85
with metadata stripped.

`share/jshvn-share-1200x630.jpg` holds both halves at once, and is the only file here
that does. It is the picture a link to ijosh.com unfurls with: the photo takes the left
square, the mark signs the charcoal beside it.

The PNGs, the ICO and the PDFs in `mark/` are rendered from the SVGs, and the JPEGs in
`photo/` from the master. Every mark form also ships as a PDF, for page layout, LaTeX and
print vendors. The icon tiles do not, since they are only for screens. See
[Building](#building).

## Where it is served

Cloudflare Pages builds `main` with `sh site/stage.sh` and serves the result at
`brand.ijosh.com`. Paths mirror the tree: `mark/jshvn-icon.svg` is
`https://brand.ijosh.com/mark/jshvn-icon.svg`. The root is an index page describing each
file.

Link to these URLs. Do not vendor the files, add this repository as a submodule, or link
to GitHub. Everything is cached for five minutes, so a change here reaches every consumer
without a redeploy. Versioned paths with `immutable` caching were rejected: they would
hand the update decision back to every consumer. Pages deploys every push to `main`; a
tag and its release only record a version.

Three things about the origin worth knowing:

- `/mark/*` and `/tokens.css` are crawlable. Google only uses a favicon it can crawl, and
  ijosh.com's favicon candidates live under `/mark/`. The stylesheet is crawlable for
  the same reason: it is something another site needs in order to draw itself.
  `site/_headers` and `site/robots.txt` have comments explaining this. If a mark ever
  surfaces in image search, `_headers` can `noindex` `/mark/*` and lift it from
  `apple-touch-icon-180.png` alone with a `!` line.
- The index page, `/social/*` and `/photo/*` are `noindex`. A search for the name should
  land on `ijosh.com`.
- `/share/*` is crawlable, which is why it is a directory of its own and not a file in
  `/social/`. It holds what ijosh.com names in `og:image`, and a search engine may fetch
  that to draw a result for the page. Same risk as the favicon, same answer.
- There are no CORS headers. `<img>`, `<link rel="icon">` and manifest icons are no-cors
  fetches. A consuming page does need this origin under `img-src` in its
  Content-Security-Policy.

`task check:urls` fetches `tokens.css` and every file in `mark/`, `social/`, `share/` and
`photo/` from the live origin and asserts status, content type, cache policy and robots
headers -- both directions, since one careless line in `site/_headers` can put a
`noindex` on `/share/*` or take one off `/social/*`.

## Using it

Find your surface in the table and follow the recipe. Every recipe uses files straight
from the tree.

| Where | What goes there | Recipe |
|---|---|---|
| A website, its favicons and its share image | The icon set, and the mark at 48px | [A website](#a-website) |
| Nothing but a favicon | `favicon.ico`, one file | [A favicon, and nothing else](#a-favicon-and-nothing-else) |
| A GitHub README, or a repo that builds | The mark at 112px | [A git repository](#a-git-repository) |
| A resume | The mark in the print greys | [A resume](#a-resume) |
| A business card, or anything else printed | The mark, vector only | [A business card](#a-business-card) |
| Your own avatar, anywhere | The photo | [An avatar](#an-avatar) |
| An avatar for something that is not a person | The icon, circle or rounded | [An avatar](#an-avatar) |
| An email signature | The mark as a hosted PNG | [An email signature](#an-email-signature) |
| A LinkedIn, Facebook or X profile banner | The banner for that platform | [A profile banner](#a-profile-banner) |
| A link to ijosh.com, unfurling anywhere | The share image | [A share image](#a-share-image) |
| A repository of mine, linked anywhere | The social preview | [A share image](#a-share-image) |
| A slide or a poster | The mark on a flat field | [A slide or a poster](#a-slide-or-a-poster) |
| Embroidery, engraving, vinyl, a stamp | The solid form, 8mm minimum | [Something in one ink](#something-in-one-ink) |
| A terminal, or ASCII art | The solid form | [A terminal](#a-terminal) |
| Anything not listed | Whatever [the rules](#the-rules) say | Add a row here when you find out |

### A website

Link the icon set from `brand.ijosh.com`, and copy one file, `favicon.ico`, to your own
site root. Browsers request `/favicon.ico` on the page's origin regardless of the tags,
and Google reads ICO but not SVG, so that copy is the icon most likely to show beside
your site in search results. It holds three sizes: the solid tile at 16 and 32, where the
grey would not survive, and the two-tone tile at 48. A copy can drift, so a check that
diffs it against `https://brand.ijosh.com/mark/favicon.ico` is worth the three lines.

```html
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="https://brand.ijosh.com/mark/jshvn-icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="https://brand.ijosh.com/mark/apple-touch-icon-180.png">
<link rel="mask-icon" href="https://brand.ijosh.com/mark/safari-pinned-tab.svg" color="#ca486d">
<link rel="manifest" href="/site.webmanifest">
```

Keep `/favicon.ico` first. Google documents no precedence between an ICO and a PNG, and
ICO is the format it definitely supports.

The Safari pinned tab is the one place the accent pink touches the mark. The file is a
single-color mask and the browser fills it with whatever `color` you name.

```json
{
  "icons": [
    { "src": "https://brand.ijosh.com/mark/jshvn-icon-maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "https://brand.ijosh.com/mark/jshvn-icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" },
    { "src": "https://brand.ijosh.com/mark/jshvn-icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
  ],
  "theme_color": "#17191c",
  "background_color": "#ffffff"
}
```

In the page itself the mark is 48px at the top of the content, in the tone that matches
the scheme:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://brand.ijosh.com/mark/jshvn-mark-on-dark.svg">
  <img src="https://brand.ijosh.com/mark/jshvn-mark-on-light.svg" alt="Josh Vaughen" width="48" height="48">
</picture>
```

The share image is already made and is four lines of markup: see
[A share image](#a-share-image).

The page's Content-Security-Policy needs `https://brand.ijosh.com` under `img-src`. Use
the name for `alt`, never "logo".

### A favicon, and nothing else

Copy `https://brand.ijosh.com/mark/favicon.ico` to the site root. That covers a small
site: three sizes, both tab themes, no markup. Add the full block above when the site
gains a manifest or gets installed.

### A git repository

Link the SVGs at `brand.ijosh.com`, so the README renders on GitHub, on mirrors, and in
viewers that do not resolve relative paths.

```html
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://brand.ijosh.com/mark/jshvn-mark-on-dark.svg">
    <img src="https://brand.ijosh.com/mark/jshvn-mark-on-light.svg" alt="Josh Vaughen" width="112">
  </picture>
</p>
```

Repositories that build something (ijosh.com, professional) link the same URLs.

### A resume

Two files, both in the print greys, which hold up under laser toner and photocopying
where the screen charcoal fills in. `mark/jshvn-mark-resume.pdf` is two-tone, `#414141`
on `#999999`, for the mark beside the name. `mark/jshvn-mark-solid-resume.pdf` is the
same ink in one tone, for icon size, where the lighter cells drop out. Each has an SVG
beside it for a web or HTML-to-PDF resume.

Place the two-tone mark left of the name, sized so the drawing matches the name's cap
height, with clear space between them. At icon size, in a contact row beside a URL or in
a footer beside a page number, use the solid file and centre it on the cap band of the
text beside it. Glyphs in such a row are centred, so a mark standing on the baseline sits
too high once it is taller than the cap height.

Do not use the two-tone mark at icon size, and do not put the mark in both the header
and the footer of one page.

The drawing fills units 16 to 84 of the file's 100-unit box, so an `\includegraphics`
height sets the box and the drawing comes out at 68% of it. Divide the height you want by
0.68 to get the box height, then lower the box by 0.16 of itself to stand the drawing on
the baseline.

```latex
% beside the name: drawing = the name's cap height
\newlength{\markbox}
\setlength{\markbox}{1.470588\fontcharht\font`X}
\raisebox{-0.16\markbox}{\includegraphics[height=\markbox]{brand/mark/jshvn-mark-resume.pdf}}
```

If the resume goes through an applicant tracking system, keep the name as real text
beside the mark. Parsers ignore the art.

### A business card

Vector only, from `mark/jshvn-mark-on-dark.svg` and `mark/jshvn-mark-on-light.svg`.
Charcoal `#17191c` front with the on-dark mark, white back with the on-light mark, the
mark at 10 to 12mm with one cell of clear space, inside the trim margin.

Send the printer the SVG or the PDF beside it, and do not let them retrace it. For
letterpress, foil, engraving, or any other single-ink process, use
[the one-ink recipe](#something-in-one-ink).

### An avatar

Upload a raster; no platform accepts SVG.

| Account | File |
|---|---|
| Personal (GitHub, LinkedIn, X, Slack) | `photo/profile-1024.jpg` |
| Organization, circle crop | `mark/jshvn-icon-circle-1024.png` |
| Organization, square or rounded crop | `mark/jshvn-icon-1024.png` |

A personal account gets the face. [Mark or photo](#mark-or-photo) explains why. The tile
is charcoal, so it keeps its edge on light and dark themes without a border.

If a form rejects the upload for size, in pixels or bytes, use the next rung of
[the photo ladder](#whats-here). The rungs share one crop, so the face stays in the same
place at every size, and a site that shows it at 40px gets a file made for that.

### An email signature

Link `jshvn-mark-on-light-512.png` at `brand.ijosh.com`, displayed at 36px, with `width`
and `height` set so the layout does not shift while it loads. Do not link to GitHub,
inline the SVG, or try to swap tones for dark mode. Most clients ignore the media query
and some strip `<picture>` entirely.

```html
<img src="https://brand.ijosh.com/mark/jshvn-mark-on-light-512.png"
     alt="Josh Vaughen" width="36" height="36">
```

### A profile banner

`social/` holds one banner per platform, at that platform's size. Upload the PNG.

| Platform | File | Pixels |
|---|---|---|
| LinkedIn, profile background | `social/jshvn-banner-linkedin-1584x396.png` | 1584 x 396 |
| Facebook, profile cover | `social/jshvn-banner-facebook-851x315.png` | 851 x 315 |
| X, profile header | `social/jshvn-banner-x-1500x500.png` | 1500 x 500 |

The avatar over the bottom left of all three is the photo, so the banner carries only the
mark. `social/` also holds `jshvn-social-preview-1280x640.png`, which is not a profile
banner -- GitHub has none -- but the preview a repository unfurls with. See
[A share image](#a-share-image).

Do not reuse a banner on another platform. Each mark is placed for its own platform's
mobile crop and overlays, and on a different platform it can land under the avatar or off
the edge. For a platform that is missing, add a row to `PLATFORMS` in `src/social.mjs`
with its canvas and safe region, then run `task build`. The generator errors if the mark
and its clear space do not fit the region.

### A share image

`share/jshvn-share-1200x630.jpg` is what a link to ijosh.com unfurls with. The photo
takes the left square and the mark signs the charcoal beside it: the one surface here
large enough for both halves of the identity.

```html
<meta property="og:image" content="https://brand.ijosh.com/share/jshvn-share-1200x630.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
```

Give the width and the height. A consumer that has them lays the card out before the
image arrives. It is a JPEG because the same picture as a PNG runs past a megabyte, and
a card still loading is a card not shown.

A repository gets `social/jshvn-social-preview-1280x640.png` instead, uploaded under
Settings, General, Social preview. It carries the mark alone: the picture stands for the
work, and the account avatar beside it is already the face. Unset, GitHub unfurls a
repository as an avatar and a grey box of file-type statistics.

### A slide or a poster

Put the mark on a flat charcoal or flat white field, at 32px or 8mm minimum, with a cell
of clear space. On a photo or gradient background, use the solid form in a charcoal tile,
or use `mark/jshvn-icon.svg`.

### Something in one ink

Embroidery, engraving, etching, vinyl cutting, stamps, letterpress, foil: any process that
lays down a single ink or cuts a single shape takes `mark/jshvn-mark-solid-on-light.svg`
at 8mm or larger. In one ink the end cells carry no meaning, and a two-tone mark comes
back as an L.

### A terminal

The solid form, drawn as five block characters on the grid. Do not approximate the grey
with a dimmer color.

## The palette

Every color ijosh.com paints is a custom property in [tokens.css](tokens.css), in a
light block and a dark block. The file is generated from `src/tokens.mjs`, committed, and
served at `https://brand.ijosh.com/tokens.css`. A site that needs a color reads it from
there and keeps no copy.

| Token | Light | Dark | What it paints |
|---|---|---|---|
| `--bg` | `#ffffff` | `#17191c` | The page. The dark value is the icon tile charcoal, so a tile sits flush on a dark page. |
| `--text` | `#333333` | `#f4f7fb` | Headings. The dark value is the mark's off-white. |
| `--text-body` | `#4b5563` | `#c6d0da` | Running text. |
| `--text-muted` | `#6b7280` | `#9aa7b4` | Captions, dates, the lede, anything secondary. |
| `--icon` | `#000000` | `#f4f7fb` | Line icons set in text. |
| `--accent` | `#ca486d` | `#e98aa3` | Links, hover states, focus rings, the Safari pinned-tab tint. |
| `--pill-bg` | `rgba(51, 51, 51, 0.1)` | `rgba(255, 255, 255, 0.1)` | Tags and pills: the text color at 10% over the page. |
| `--btn-bg`, `--btn-fg` | `#1c1c1c`, `#ffffff` | `#f4f7fb`, `#14171c` | The one filled button and its label. |
| `--mark`, `--mark-muted` | `#17191c`, `#666666` | `#f4f7fb`, `#9c9ea2` | The mark's two tones, read from `src/marks.mjs` so they cannot drift from the artwork. |

The greys are the palette: a light or charcoal page, text in three weights, and the mark
in the tones for that surface. The accent is the only color, and it is deliberately rare
so links stay findable and the mark stays quiet. The two mark tokens are for an inlined
SVG or a mark drawn in CSS; every file in `mark/` already carries the tones.

### Using the palette

**Inline the values at build time.** Fetch `tokens.css` in your build, or paste the
block into your stylesheet, and add a check that diffs the copy against the origin, as
with `favicon.ico`. Do not `@import` it: a cross-origin stylesheet blocks your page from
rendering until brand.ijosh.com answers.

**Let the theme follow the reader.** The dark block applies under
`prefers-color-scheme: dark` unless `<html>` has `data-theme="light"`, and always when it
has `data-theme="dark"`. A theme toggle only has to set that attribute, and every token
follows, `--mark` included. Do not write a second dark block of your own.

**Use the tokens, not the values.** `color: var(--text)` follows the theme;
`color: #333333` stays dark when the reader switches. If a surface needs a color the
table lacks, add it to `src/tokens.mjs` and run `task build`, so every consumer gets it.

**Keep the accent on links**, hover states and focus rings. Headings, borders, buttons
and the mark stay grey.

## The rules

### Which form

Use the two-tone mark on white, off-white, light grey, dark grey, charcoal or black, at
32px or 8mm and larger. Use the solid form everywhere else: mid-tones, color,
photographs, gradients, anything under 32px, and every single-ink process such as
engraving, embroidery, vinyl, stamps and pinned tabs.

The two lighter end cells are what make the mark a J. On a mid-grey surface they
disappear and the mark reads as an L. The solid form has no such dependency.

### Color

The mark uses two tones. The stem, the base and the corner that joins them are one
strong ink. The serif at the top and the tip of the tail, the **end cells**, are a
lighter grey.

Every file in `mark/` has the right pair drawn in, so normally you pick the file and are
done. The table is for reproducing the mark where a file cannot go: a print shop's spec
sheet, a slide master, a CSS variable, a vendor's brand form.

| Where you are putting the mark | The background behind it | Most of the J | The two end cells | File to use |
|---|---|---|---|---|
| A white or light-grey screen | yours, anything white to light grey | `#17191c` near-black | `#666666` mid grey | `jshvn-mark-on-light.svg` |
| A dark or charcoal screen | yours, anything dark grey to black | `#f4f7fb` off-white | `#9c9ea2` light grey | `jshvn-mark-on-dark.svg` |
| A printed resume | the white paper | `#414141` soft black | `#999999` mid grey | `jshvn-mark-resume.svg`, `.pdf` |
| A printed resume, at icon size | the white paper | `#414141` soft black | `#414141`, the same ink | `jshvn-mark-solid-resume.svg`, `.pdf` |
| An app icon, favicon, or avatar | `#17191c` charcoal, drawn into the file | `#f4f7fb` off-white | `#9c9ea2` light grey | `jshvn-icon*.svg` |

**The background** is the surface behind the mark. The mark files are transparent, so on
the first three rows that color is yours to supply. The icons include their tile, so they
look the same on any page.

The resume greys are softer than the screen tones on purpose. True near-black fills in
under laser toner and on a photocopier, where `#414141` on `#999999` still separates.

The accent pink `#ca486d` is never used in the mark. It appears on links, hover states
and the Safari pinned-tab tint. Both the tones and the accent are tokens in
[the palette](#the-palette); the tones are read from `src/marks.mjs` there, so the
stylesheet cannot drift from the artwork.

### Size and space

- Clear space is one cell, 24 units, on every side.
- Minimum size: mark 32px or 8mm, solid 16px or 4mm. The floor is about what survives
  reproduction, so it applies to screens, rasters and single-ink processes. Vector
  artwork in a PDF has no floor; the solid form prints clean at the cap height of the
  text beside it.
- In a circle, the mark is 74% of the diameter. `jshvn-icon-circle.svg` does this.
- The bars keep the cell radius. Do not round them further.

### Mark or photo

The photo in `photo/` is the other half of the identity.

- **The face where someone expects to meet a person.** Avatars on personal accounts:
  GitHub, LinkedIn, Instagram, X, Slack, the sender photo in email. A logo there reads as
  a company.
- **The mark where someone expects to meet the work.** Favicons, READMEs, the resume,
  cards, signatures, organization accounts, and anything printed. A face on a resume is
  a liability.
- **Both, when the surface is large enough:** the website and
  [the share image](#a-share-image). The photo is the larger element and the mark is the
  signature.
- **A profile page already has both.** The avatar is the photo, so the banner carries
  only the mark.

Keep one photo across every account, with the same crop, and change it everywhere at
once. `photo/profile.png` is the master; replace it, run `task build`, and every rung
below it follows.

### Never

- Pink, or any color, in the mark.
- Cells added, moved, or recolored.
- The two-tone mark under 32px.
- Rotation, mirroring, outlines, or drop shadows.
- The mark on a mid-grey, a photo, or a gradient. Use the solid form.

## Building

`src/tokens.mjs` defines every color. `src/marks.mjs` defines the grid and the drawing,
and `src/social.mjs` and `src/share.mjs` place the mark on their canvases through it.
Each module exports data, and `src/build.mjs` is the only thing that writes files: the
SVGs and tokens.css, then the PNGs, the ICO, the PDFs, the photo ladder and the share
image with librsvg and ImageMagick inside a pinned Alpine image. Outputs are committed,
so consumers never run this.

The share image is the one composite: `src/share.mjs` draws its charcoal half, and the
build lays the photo master on the square beside it. Its SVG is never written, because
half a picture is not a source anyone should be served.

A redraw is an edit to `src/marks.mjs` and a `task build`.

```sh
task          # the menu
task build    # regenerate mark/, social/, share/ and tokens.css
task check    # prove mark/, social/, share/ and photo/ match a fresh build
```

The host needs [go-task](https://taskfile.dev) and a container engine: Apple `container`
on macOS when its daemon is up, otherwise Docker. `ENGINE=docker task check` forces one.

## License

The mark and the photo are my own work, all rights reserved. The code is MIT, and that
grant covers the code and not the design it draws. See [LICENSE.md](LICENSE.md).
