<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="mark/jshvn-mark-on-dark.svg">
    <img src="mark/jshvn-mark-on-light.svg" alt="Josh Vaughen" width="112">
  </picture>
</p>

<h1 align="center">brand</h1>

<p align="center">The mark for Josh Vaughen and ijosh.com, the rules for using it, and every file other repos consume.</p>

This repository is the source of truth for the personal mark. Other repositories
vendor files from `mark/`, add this repository as a submodule pinned to a tag, or
link to the files by URL. Nothing here is generated at consumption time.

[What's here](#whats-here) - [Using it](#using-it) - [The rules](#the-rules) -
[Building](#building) - [License](#license)

## What's here

A J built on a three by three grid: 24 unit pitch, 20 unit cells, 4 unit gaps and
radius, in a 100 unit box. The stem and base are bars. The two cells at the ends of the
stroke, the serif at the top and the tail of the hook, are set in a lighter tone so the
letter reads as drawn with a pen that lifts at each end.

It comes in two forms.

| Form | File | Use |
|---|---|---|
| **Mark** | `jshvn-mark-on-light.svg`, `jshvn-mark-on-dark.svg` | The primary form. Two tones. |
| **Mark, solid** | `jshvn-mark-solid-on-light.svg`, `jshvn-mark-solid-on-dark.svg` | One tone. Everywhere the grey cannot be trusted. |

And in three containers, each a charcoal tile holding the on-dark mark.

| Container | File | Use |
|---|---|---|
| **Icon** | `jshvn-icon.svg` | Rounded tile, 22% radius. App icons, favicons at 48px and above. |
| **Icon, square** | `jshvn-icon-square.svg` | Square tile. Apple touch icon; iOS rounds it. |
| **Icon, circle** | `jshvn-icon-circle.svg` | Circle with the mark at 74%. Any avatar that is a circle. |
| **Icon, maskable** | `jshvn-icon-maskable.svg` | Square with the mark at 74%. Android maskable icons. |
| **Icon, solid** | `jshvn-icon-solid.svg` | Rounded tile with the solid mark. Favicons at 16 and 32px. |

The photo is the other half of the identity, and it is not the mark.
`photo/profile.png` is the master. The JPEGs beside it are the same crop at smaller
sizes, for upload forms that cap the pixels, the bytes, or both.

| File | Pixels | Weight |
|---|---|---|
| `profile.png` | 1024 | 1.6 MB, the master, lossless |
| `profile-1024.jpg` | 1024 | 126 KB |
| `profile-512.jpg` | 512 | 33 KB |
| `profile-400.jpg` | 400 | 20 KB |
| `profile-256.jpg` | 256 | 9 KB |
| `profile-128.jpg` | 128 | 3 KB |
| `profile-64.jpg` | 64 | 1 KB |

The weights are for the photo committed today; they move when the photo does. Every
rung is quality 85 with the metadata stripped.

The PNGs, the ICO and the PDF in `mark/` are rendered from the SVGs, and every JPEG in
`photo/` from the photo master. See [Building](#building).

## Using it

Find your surface, take the file, follow the recipe. Every recipe uses files straight
out of `mark/`; nothing is re-exported, re-traced, or redrawn.

| Where | What goes there | Recipe |
|---|---|---|
| A website, its favicons and its share image | The icon set, and the mark at 48px | [A website](#a-website) |
| Nothing but a favicon | `favicon.ico`, one file | [A favicon, and nothing else](#a-favicon-and-nothing-else) |
| A GitHub README, or a repo that builds | The mark at 112px, pinned to a tag | [A git repository](#a-git-repository) |
| A resume | The mark in the print greys | [A resume](#a-resume) |
| A business card, or anything else printed | The mark, vector only | [A business card](#a-business-card) |
| Your own avatar, anywhere | The photo, not the mark | [An avatar](#an-avatar) |
| An avatar for something that is not a person | The icon, circle or rounded | [An avatar](#an-avatar) |
| An email signature | The mark as a hosted PNG | [An email signature](#an-email-signature) |
| A slide, a poster, a LinkedIn banner | The mark on a flat field | [A slide, a poster, a banner](#a-slide-a-poster-a-banner) |
| Embroidery, engraving, vinyl, a stamp | The solid form, 8mm minimum | [Something in one ink](#something-in-one-ink) |
| A terminal, or ASCII art | The solid form | [A terminal](#a-terminal) |
| Anything not listed | Whatever [the rules](#the-rules) name | Add a row here when you find out |

### A website

Ship the whole icon set. `favicon.ico` carries three sizes on its own, the solid tile at
16 and 32 where the grey would not survive and the two-tone tile at 48, so one file
covers a light and a dark browser chrome.

```html
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="/jshvn-icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon-180.png">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ca486d">
<link rel="manifest" href="/site.webmanifest">
```

The Safari pinned tab is the one place the accent pink belongs on the mark's shape: the
file is a single-color mask and the browser paints it in whatever `color` you name.

```json
{
  "icons": [
    { "src": "/jshvn-icon-maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/jshvn-icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" },
    { "src": "/jshvn-icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
  ],
  "theme_color": "#17191c",
  "background_color": "#ffffff"
}
```

In the page itself the mark is 48px at the top of the content panel, in whichever tone
matches the scheme:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/mark/jshvn-mark-on-dark.svg">
  <img src="/mark/jshvn-mark-on-light.svg" alt="Josh Vaughen" width="48" height="48">
</picture>
```

For the share image, the one that previews in a link unfurl, the photo takes one half
and the mark sits on the white half beside it, never over the photo.

Serve the SVGs from your own origin, not from GitHub. `alt` is the name, never "logo".

### A favicon, and nothing else

Copy `mark/favicon.ico` to the site root. That is the whole job for a small site: three
sizes in one file, both tab themes, no markup beyond the browser's default lookup. Add
the rest of the block above when the site grows a manifest or gets installed.

### A git repository

Link to the SVGs by URL, pinned to a tag, so the README renders on GitHub, on a mirror,
and in any viewer that does not resolve relative paths.

```html
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jshvn/brand/v1.0.0/mark/jshvn-mark-on-dark.svg">
    <img src="https://raw.githubusercontent.com/jshvn/brand/v1.0.0/mark/jshvn-mark-on-light.svg" alt="Josh Vaughen" width="112">
  </picture>
</p>
```

A repository that builds something (ijosh.com, professional) takes the files instead of
linking them: add this repository as a submodule pinned to a tag, or vendor the two or
three files it needs and note the tag in the commit.

```sh
git submodule add https://github.com/jshvn/brand brand
git -C brand checkout v1.0.0
```

Pin the tag either way. An unpinned `main` means a redraw here silently changes every
README that points at it.

### A resume

Use `mark/jshvn-mark-resume.pdf` in a page layout or LaTeX, `mark/jshvn-mark-resume.svg`
in a web or HTML-to-PDF resume. Both carry the print greys, `#414141` on `#999999`,
which hold on laser toner and photocopies where the screen charcoal fills in.

Place it left of the name, sized to the cap height of the name, with the clear space
kept between the two. In the footer, beside a page number or a URL, use the solid form
at text size. Never both greys at footer size, and never the mark in a header and a
footer on the same page.

```latex
\includegraphics[height=\fontcharht\font`X]{brand/mark/jshvn-mark-resume.pdf}
```

If the resume is going through an applicant tracking system, keep the name as real text
next to the mark. Parsers read the text and ignore the art.

### A business card

Vector only, from `mark/jshvn-mark-on-dark.svg` and `mark/jshvn-mark-on-light.svg`.
Charcoal `#17191c` front with the on-dark mark, white back with the on-light mark, the
mark at 10 to 12mm with one cell of clear space, never inside the trim margin.

Send the printer the SVG or a PDF exported from it, not a PNG, and do not let them
re-trace it. For letterpress, foil, engraving, or any process that lays down one ink,
use [the one-ink recipe](#something-in-one-ink) instead.

### An avatar

Upload a raster, since no platform takes an SVG.

| Account | File |
|---|---|
| Personal (GitHub, LinkedIn, X, Slack) | `photo/profile-1024.jpg` |
| Organization, circle crop | `mark/jshvn-icon-circle-1024.png` |
| Organization, square or rounded crop | `mark/jshvn-icon-1024.png` |

A personal account gets the face, not the mark; [Mark or photo](#mark-or-photo) says
why. The tile is charcoal, so it holds its edge on both a light and a dark platform
theme without a border.

When a form rejects the upload for being too large, in pixels or in bytes, drop to the
next rung of [the photo ladder](#whats-here) rather than re-exporting one by hand. The
rungs are the same crop, so the face keeps the same position at every size, and a site
that shows it at 40px gets the file meant for that, not a 1024 scaled down in the
browser.

### An email signature

Link to `jshvn-mark-on-light-512.png` served by ijosh.com, at 36px displayed, and set
`width` and `height` in the HTML so it does not reflow while it loads. Do not link to
GitHub, do not inline the SVG, and do not try to swap tones for dark mode: most clients
ignore the media query, and a few strip the `<picture>` element outright.

```html
<img src="https://ijosh.com/mark/jshvn-mark-on-light-512.png"
     alt="Josh Vaughen" width="36" height="36">
```

### A slide, a poster, a banner

The mark goes on a flat charcoal or a flat white field, at 32px or 8mm minimum, with a
cell of clear space. On a photographic or gradient background, put the solid form in a
charcoal tile, or use `mark/jshvn-icon.svg` and let the tile do the work. Never key the
mark straight over an image.

A LinkedIn banner is this case: the mark on a charcoal field. If the banner becomes a
photograph, the mark goes solid.

### Something in one ink

Embroidery, engraving, etching, vinyl cutting, a rubber stamp, letterpress, foil: every
process that lays down a single ink or cuts a single shape takes
`mark/jshvn-mark-solid-on-light.svg`, at 8mm or larger. The end cells carry no meaning
in one ink, and a two-tone mark sent to one of these comes back as an L.

### A terminal

The solid form, drawn as five block characters on the grid. The two tones have no
equivalent in a terminal cell, so do not try to approximate the grey with a dimmer
color.

## The rules

### Which form

**Use the mark when the surface is white, off-white, light grey, dark grey, charcoal
or black, and the mark is 32px or 8mm or larger.** In every other case use the solid
form. That covers mid-tones, color, photographs, gradients, anything under 32px, and
every process that prints a single ink: engraving, embroidery, vinyl, stamps, pinned
tabs.

The two lighter end cells are what make the mark a J. They disappear on a mid-grey
surface, and a mark without them is an L. The solid form has no such dependency, so it
is the fallback for everything the rule does not name.

### Color

The mark is drawn in two tones. Most of the J is one strong ink: the stem, the base, and
the corner that joins them. Two single cells at the ends of the stroke are a lighter
grey: the serif at the top, and the tip of the tail. Those two are the **end cells**,
and they are what make the shape read as a J rather than an L.

Every file in `mark/` already has the correct pair of colors drawn into it, so normally
you pick the file and are done. The table is for the times you have to reproduce the
mark where a file cannot go: a print shop's spec sheet, a slide master, a CSS variable,
a vendor's brand form.

| Where you are putting the mark | The background behind it | Most of the J | The two end cells | File to use |
|---|---|---|---|---|
| A white or light-grey screen | yours, anything white to light grey | `#17191c` near-black | `#666666` mid grey | `jshvn-mark-on-light.svg` |
| A dark or charcoal screen | yours, anything dark grey to black | `#f4f7fb` off-white | `#9c9ea2` light grey | `jshvn-mark-on-dark.svg` |
| A printed resume | the white paper | `#414141` soft black | `#999999` mid grey | `jshvn-mark-resume.svg`, `.pdf` |
| An app icon, favicon, or avatar | `#17191c` charcoal, drawn into the file | `#f4f7fb` off-white | `#9c9ea2` light grey | `jshvn-icon*.svg` |

Read the rows this way. **The background** is the surface the mark sits on; the mark
files are transparent and paint nothing behind themselves, so on the first three rows
that color is whatever you put there and is your job to get right. On the last row it is
part of the file, which is the point of the icons: the tile brings its own background, so
the mark looks the same on any page that hosts it.

**Most of the J** and **the two end cells** are the two tones inside the artwork. The
resume row is softer than the screen rows on purpose: a true near-black fills in under
laser toner and on a photocopier, where `#414141` on `#999999` still separates.

The site accent, pink `#ca486d`, is never one of those tones. It stays on links, the
hover state, and the Safari pinned-tab tint, so the mark stays quiet and the accent stays
rare. All color tokens are in [tokens.css](tokens.css) as a reference copy; the live
source is `assets/css/style.css` in jshvn/ijosh.com.

### Size and space

- Clear space is one cell, 24 units, on every side. Nothing else enters it.
- Minimum size: mark 32px or 8mm, solid 16px or 4mm.
- In a circle, the mark is 74% of the diameter. `jshvn-icon-circle.svg` does this.
- The bars are cells joined; they keep the cell radius. Never round them further.

### Mark or photo

The photo in `photo/` is the other half of the identity, and the two never compete.

- **A face where someone expects to meet a person.** Avatars on personal accounts:
  GitHub, LinkedIn, Instagram, X, Slack, the sender photo in email. People recognize
  contributors and colleagues by face, and a logo there reads as a company.
- **The mark where someone expects to meet the work.** Favicons, READMEs, the resume,
  cards, signatures, organization accounts, and anything printed. A face there is out
  of place, and a face on a resume is a liability.
- **Both, when the surface is large enough:** the website and the share image. The photo
  is the larger element and the mark is the signature.

Keep one photo across every account, cropped the same way, and change it everywhere at
once or nowhere. `photo/profile.png` is the master; replace it, run `task build`, and
every rung below it follows.

### Never

- Pink, or any color, in the mark.
- Cells added, moved, or recolored independently of the color table above.
- The two-tone mark under 32px.
- Rotated, mirrored, outlined, or with a drop shadow.
- The mark on a mid-grey, a photo, or a gradient. Use the solid form.

## Building

The SVGs are generated by `src/marks.mjs` and every PNG, ICO and PDF is rendered from
them inside a pinned Alpine image with librsvg and ImageMagick. The photo ladder is
resized from `photo/profile.png` in the same image. Outputs are committed, so consumers
never run this.

```sh
task          # the menu
task build    # regenerate mark/
task check    # prove mark/ and photo/ match a fresh build
```

The host needs [go-task](https://taskfile.dev) and a container engine: Apple
`container` on macOS when its daemon is up, otherwise Docker. `ENGINE=docker task check`
forces one.

## License

The mark and the photo are my own work, all rights reserved. The code is MIT, and that
grant covers the code and not the design it draws. See [LICENSE.md](LICENSE.md).
