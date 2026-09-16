# brand.ijosh.com

Status: approved, not yet built
Date: 2026-09-15

## The goal

Every file in `mark/` and `photo/` is reachable at `https://brand.ijosh.com/<path>`,
served by a Cloudflare Pages project that this repository owns and deploys. A push to
`main` publishes, and a redraw reaches every consumer within five minutes. Consuming
repositories link to the URLs and hold no copies -- no submodule, no vendoring, no sync
step, no cost.

The site's root is an index page documenting the design system and linking back to the
README, so the origin explains itself to anyone who lands on a file URL and deletes the
trailing path.

`ijosh.com` today ships a hand-drawn favicon that is not the mark, in four files it
owns. Afterwards it owns one -- `favicon.ico`, which both a browser convention and
Google's format support pin to the apex -- and links to the rest.

## The decision

A Pages project on this repository with `brand.ijosh.com` attached. Not a path on
`ijosh.com`, and not a submodule.

```
https://brand.ijosh.com/mark/jshvn-icon.svg     -> Pages project "brand"   (this repo)
https://ijosh.com/                              -> Pages project "josh"    (unchanged)
```

**Why a subdomain and not a path on the apex.** A Worker route could intercept
`ijosh.com/brand/*`, but it would declare part of `ijosh.com`'s routing in a
`wrangler.jsonc` here while `personal/terraform` declares the rest -- two sources of
truth for one hostname. It would also need a Cloudflare API token, a 1Password item, a
GitHub secret and an Actions workflow, none of which a Pages project needs. And a route
pattern matching `/brand/*` shadows any page at `/brand`, which is exactly the index
page this design wants.

**Why this is free.** Pages serves unlimited requests and unlimited bandwidth on the
free plan, with 500 builds a month. Nothing here approaches that, and the five-minute
cache below does not change it.

**What CORS has to do with it: nothing.** `<img>`, `<link rel="icon">`,
`<link rel="apple-touch-icon">` and manifest icon fetches are no-cors requests --
browsers render them cross-origin without `Access-Control-Allow-Origin`. CORS engages
only for `fetch`/XHR, a `crossorigin` attribute, or canvas pixel reads, none of which
apply. The exception is web fonts: if this repository ever serves a typeface, those
responses need `Access-Control-Allow-Origin` and consumers need `font-src` in their CSP.

## The URL contract

Paths mirror the repository, so a URL predicts the file and a file predicts the URL.

| URL | Source |
|---|---|
| `https://brand.ijosh.com/` | the index page |
| `https://brand.ijosh.com/mark/<file>` | `mark/<file>`, every file |
| `https://brand.ijosh.com/photo/<file>` | `photo/<file>`, every file |

What `ijosh.com` consumes:

| URL | Used by |
|---|---|
| `https://brand.ijosh.com/mark/jshvn-icon.svg` | `rel="icon" type="image/svg+xml"` |
| `https://brand.ijosh.com/mark/apple-touch-icon-180.png` | `rel="apple-touch-icon"` |
| `https://brand.ijosh.com/mark/safari-pinned-tab.svg` | `rel="mask-icon" color="#ca486d"` |
| `https://brand.ijosh.com/mark/jshvn-icon-maskable-192.png` | manifest, `purpose: maskable` |
| `https://brand.ijosh.com/mark/jshvn-icon-maskable-512.png` | manifest, `purpose: maskable` |
| `https://brand.ijosh.com/mark/jshvn-icon-512.png` | manifest, `purpose: any` |
| `https://brand.ijosh.com/mark/jshvn-mark-on-light-512.png` | email signature |
| `https://ijosh.com/favicon.ico` | Google's index, and the browser root probe |

## Caching: five minutes

Every asset this origin serves carries `Cache-Control: public, max-age=300`, and so
does the apex `favicon.ico`.

Five minutes is the propagation budget. It is what makes "push here, consumers change"
true rather than nearly true: a redraw is live everywhere inside the time it takes to
write the commit message. Longer TTLs trade that away for bandwidth this design does not
pay for -- Pages bandwidth is unlimited and free, so the usual reason to cache hard does
not apply.

It is not shorter than five minutes because a single page load pulls several of these
files and a visitor may load several pages; five minutes absorbs a session without
holding a stale mark into the next one.

Versioned paths would allow `immutable`, and are rejected: they would move the update
decision back into every consumer, which is the coupling this design exists to remove.

## The one file the apex keeps

`ijosh.com` keeps `static/favicon.ico`, one 15 KB file, holding this repository's
`mark/favicon.ico`. Two independent reasons:

**Google can use an ICO and cannot use an SVG.** Google's supported favicon formats are
BMP, GIF, ICO, PNG, JPEG, PPM and TIFF. `brand.ijosh.com/mark/jshvn-icon.svg` is a
browser nicety that Google cannot read at all. That leaves two Google-eligible
candidates -- the apex ICO and the cross-origin `apple-touch-icon` PNG -- and Google
documents no precedence between them. The apex ICO is therefore the likeliest thing
Google puts in a search result.

**Browsers probe the origin of the page.** `https://ijosh.com/favicon.ico` is requested
against the apex regardless of what any `<link>` tag says, and a subdomain cannot answer
it.

Google is content with a cross-origin favicon -- "The URL doesn't need to be hosted on
your site (for example, your favicon could be hosted on a content delivery network
(CDN))" -- which is what licenses the rest of this design. It simply cannot read the one
format the subdomain leads with.

This file is the only thing in the design that can drift: a redraw here changes
`brand.ijosh.com/mark/favicon.ico` while the apex copy stays stale. `ijosh.com` gets a
check that fetches both and fails when the bytes differ. What that check protects is not
a tab icon nobody notices; it is the icon beside `ijosh.com` in a search result.

**The rejected alternative** is a `_redirects` rule sending the apex `/favicon.ico` to
this origin, removing both the file and the drift. Its cost is one redirect hop on the
most-requested asset on the site. That is the whole cost: Google reads `<link>` tags and
documents no root probe, so a redirect there is invisible to it either way, and Google
documents nothing about favicon redirect handling in either direction -- do not let
anyone cite it as supported or unsupported. Rejected on the hop alone, and it is a
one-line change if the drift check ever becomes more trouble than the hop.

**Bing is not a design input.** Microsoft publishes no favicon documentation --
not in the webmaster guidelines, not on learn.microsoft.com, not on the Bing blog. The
rules in circulation (".ico required", "must be 200, never a 301", "probes the root when
there is no link tag") trace to third-party SEO posts, not to Microsoft. Bing does not
display a favicon for `ijosh.com` today, so there is also no working behaviour to
protect. The comment in `head.html` asserting that ".ico is the path Bing's crawler
relies on" is folklore and is corrected as part of this work.

## Changes, by repository

### jshvn/brand

**`src/stage-site.sh`** -- assembles `public/` from the committed tree. Pure `cp` plus
one generated file, so it runs in the Pages build image with no toolbox and no
dependencies.

```
public/index.html   <- src/index.html
public/mark/        <- mark/
public/photo/       <- photo/
public/_headers     <- src/_headers
public/robots.txt   <- src/robots.txt
```

**`src/index.html`** -- the page at the root. What the mark is, the two forms and the
containers, the rules that matter, a table of what to use where, the photo ladder with
its sizes and weights, and a link to the README for the full text. Self-contained:
inline CSS, no build step, no framework, and it uses the files beside it, so the page is
also a proof that they are being served.

It lists `photo/` in full, including `profile.png`, the 1.6 MB lossless master. The
photo is half the identity and the master is the file you reach for when an upload form
wants the best available source; hiding it would mean going to the repository for the
one file most likely to be wanted in a hurry. Its size is a non-issue here -- it is
downloaded deliberately by a person, not embedded in a page, so the five-minute TTL
never applies to it in practice.

**`src/_headers`** -- Pages supports `_headers` natively.

```
/
  X-Robots-Tag: noindex

/photo/*
  X-Robots-Tag: noindex
  Cache-Control: public, max-age=300
  X-Content-Type-Options: nosniff

/mark/*
  Cache-Control: public, max-age=300
  X-Content-Type-Options: nosniff

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

## This origin does not appear in search, and `/mark/` stays crawlable anyway

Searching a name should return `ijosh.com`, not an asset origin. So the index page is
`noindex`. Two rules, and the line between them is the whole point:

**`/` and `/photo/*` are `noindex`.** Nothing external depends on either being indexed,
so this costs nothing. The index page still serves, still renders, still documents the
system -- it simply does not rank.

`/photo/*` is the case worth being explicit about, because the photo is published in
full and documented on the index. A face matched to a name is the single most likely way
an asset origin surfaces in a search for that name, which is the outcome being avoided.
Putting Josh in front of people searching his name is `ijosh.com`'s job -- it carries the
JSON-LD `Person`, the share image and the profile photo already -- and an asset origin
should not compete with it for the same query. The files stay public, linkable and
listed; they are simply not a search result.

**`/mark/*` carries no robots directive at all, deliberately.** Google requires that
Googlebot-Image be able to crawl a favicon it is expected to use, and the cross-origin
`apple-touch-icon` is one of the two candidates for `ijosh.com`. `noindex` does not
block crawling, so a `noindex` there might be survivable -- but whether Google will use
a `noindex` image as a favicon is undocumented, and the downside is a blank icon in a
search result. The favicon is the entire reason this origin exists. It does not get
risked to suppress a result that the `noindex` on `/` already suppresses.

In practice that is enough. Images rank largely on the context of the page that embeds
them, and with the index page unindexed the mark files have almost no context to rank
on. If a mark URL ever does surface in image search, the surgical fix is a `noindex` on
`/mark/*` with a `! X-Robots-Tag` removal on `apple-touch-icon-180.png` alone -- Pages
`_headers` supports header removal with `!` -- but that depends on rule-combination
order and should be verified against live behaviour before it is trusted.

**No `robots.txt` may disallow `/mark/`.** `robots.txt` blocks crawling outright, which
is the one thing Google's favicon requirement forbids. This repository ships an explicit
permissive one carrying that reason as a `#` comment, so the next person to reach for
`Disallow: /` on an asset origin -- the natural instinct, and the wrong one here --
reads why first.

```
# brand.ijosh.com serves ijosh.com's favicon. Googlebot-Image must be able to crawl
# /mark/ or the favicon disappears from search results. Do not disallow it.
# The index page is kept out of search with X-Robots-Tag in _headers, not here.
User-agent: *
Allow: /
```

**`.gitignore`** -- add `public/`.

**`Taskfile.yml`** -- `site` (stage into `public/`), `site:serve` (stage, then any static
server, to read the index page locally), and `check:urls` (curl every published URL,
assert status, content type, and `max-age=300`). New lines in the hand-maintained menu.

**`README.md`** -- the website recipe's icon URLs become `brand.ijosh.com/mark/` ones,
and the email-signature recipe moves off `ijosh.com/mark/`, which nothing will serve. A
new section states that this repository serves `brand.ijosh.com`, that the paths mirror
the tree, and that consumers link rather than copy. The submodule suggestion in "A git
repository" goes: linking is now the answer for every consumer that can reach the
network at build time.

### personal/terraform

Three additions, in the shape the existing resources use.

`account/pages.tf`:

```hcl
resource "cloudflare_pages_project" "brand" {
  account_id        = var.account_id
  name              = "brand"
  production_branch = "main"
  build_config = {
    build_command   = "sh src/stage-site.sh"
    destination_dir = "public"
    root_dir        = ""
  }
  source = {
    config = {
      owner                          = "jshvn"
      owner_id                       = "1392714"
      production_branch              = "main"
      production_deployments_enabled = true
      repo_id                        = "1372332571"
      repo_name                      = "brand"
      # ... preview settings, matching the other projects
    }
    type = "github"
  }
}

resource "cloudflare_pages_domain" "brand_ijosh_com" {
  account_id   = var.account_id
  name         = "brand.ijosh.com"
  project_name = cloudflare_pages_project.brand.name
}
```

`zones/ijosh.com/dns/records.tf` -- a `cname_brand` record onto `brand.pages.dev`,
proxied, `comment = "zones/ijosh.com/dns"`, shaped like `cname_apex`.

No `HUGO_VERSION` and no `deployment_configs` env vars: the build is a shell script.

### jshvn/ijosh.com

`layouts/partials/head.html`, the favicon block. The order is deliberate and must not be
tidied: `/favicon.ico` leads because precedence between the two Google-eligible
candidates is undocumented, and the ICO is the one whose format Google certainly
supports. The comment above the block is rewritten -- it currently credits Bing, which
is not a constraint; what the ICO is actually for is Google's index and the browser's
origin probe.

```html
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
<link rel="icon" href="https://brand.ijosh.com/mark/jshvn-icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="https://brand.ijosh.com/mark/apple-touch-icon-180.png" />
<link rel="mask-icon" href="https://brand.ijosh.com/mark/safari-pinned-tab.svg" color="#ca486d" />
<link rel="manifest" href="/site.webmanifest" />
```

`static/_headers` -- two changes. The CSP gains one origin, since manifest icons are
unambiguously governed by `img-src` and `'self'` is origin-exact:

```
img-src 'self' data: https://brand.ijosh.com;
```

and the apex favicon joins the brand assets on a five-minute TTL:

```
/favicon.ico
  Cache-Control: public, max-age=300
```

`static/site.webmanifest` -- the `icons` array points at the three
`brand.ijosh.com/mark/` PNGs. The manifest file itself stays same-origin, so
`manifest-src` is untouched.

`static/favicon.ico` -- replaced with this repository's `mark/favicon.ico`, and kept.

Deleted: `static/favicon.svg`, `assets/images/favicon-192.png`,
`assets/images/favicon.png`, and the `favicon` and `appleTouchIcon` params in
`hugo.toml`. Those params resolve through `resources.Get` against `assets/`, and the
files are no longer in the build.

`CLAUDE.md`, three places, describing the system as it then is:

- The architecture invariant reads "no third-party runtime assets." It needs to say that
  icons load from `brand.ijosh.com`, a self-owned origin deployed from `jshvn/brand`, and
  that this is the one cross-origin exception -- otherwise the next reader deletes the
  CSP line as a mistake.
- The gotcha "`/favicon.ico` and `/favicon.svg` live in `static/` at fixed root paths" is
  half true afterwards: `favicon.ico` stays and now has a reason recorded, `favicon.svg`
  is gone.
- The Hugo params list drops `favicon` and `appleTouchIcon`.

`Taskfile.yml` -- a `check:favicon` that fetches `brand.ijosh.com/mark/favicon.ico` and
diffs it against `static/favicon.ico`.

### katoptra/site

Nothing required, and one thing made possible. This design removes the problem the
path-routing version created: `katoptra.org` can link `brand.ijosh.com` URLs directly
rather than needing routes of its own.

It vendors `ijosh.com`'s `static/` into `themes/ijosh`, so its next `task theme:update`
picks up an apex `favicon.ico` that is now the mark, and loses `favicon.svg`. Its
shadow-diff list names both files and needs the dead one dropped. Whether katoptra.org
should wear Josh's mark at all is a separate question for that repository -- it is a
project, not a person, and the honest answer is probably not.

## Cost

Zero. Pages is unlimited requests and unlimited bandwidth on the free plan, 500 builds a
month, and this repository builds when the mark changes. The five-minute TTL raises
request volume against a quota that does not exist. No Workers, no R2, no KV. No
Cloudflare API token, no 1Password item, no GitHub secret, no Actions workflow -- Pages
deploys from GitHub the way `josh`, `mirrors` and `plex` already do.

## Verification

**`task check:urls`** -- the one runnable check here. Curls every published URL and
asserts a 200, the expected content type, and `max-age=300`. It also asserts that `/`
carries `X-Robots-Tag: noindex` and that `/mark/*` does not, since those two facts are a
matched pair and a copy-paste in `_headers` breaks them together. It fails if staging
drops a file, if the domain is detached, if a build did not land, or if the cache policy
drifts.

**`task check:favicon`** on `ijosh.com` -- fails when the apex copy drifts from this
origin. This one guards a search result, not a tab.

**On the consumer** -- `task build`, then grep `public/index.html` for the five link tags
and the three manifest URLs. `task visual:check` must pass *unchanged*: favicons live in
browser chrome, not in the golden screenshots, so a visual diff means something else
broke.

**By hand, once** -- load `ijosh.com` with devtools open and confirm no CSP violation is
reported for any icon, in light and dark. The CSP line is the one change that fails
silently and only in some browsers.

**Observational, over weeks** -- confirm `brand.ijosh.com` does not rank for the name,
and run URL inspection on the `ijosh.com` homepage in Google Search Console and see which favicon Google resolved. Not a gate on any merge: Google
warns that "a favicon isn't guaranteed to appear in Google Search results, even if all
guidelines are met", and refresh is slow. It is how the undocumented precedence between
the apex ICO and the cross-origin PNG gets answered in practice.

## Rollout

Ordered so there is never a window without a favicon. `brand.ijosh.com` goes live first
and `ijosh.com` keeps working untouched throughout; the consumer change is one revertible
PR afterwards.

1. `personal/terraform`: Pages project, domain, CNAME. Apply. Confirm `brand.pages.dev`
   resolves and `brand.ijosh.com` serves.
2. `jshvn/brand`: staging script, `index.html`, `_headers`, Taskfile, README. Push to
   `main`. Verify with `task check:urls`.
3. `jshvn/ijosh.com`: markup, the rewritten comment, CSP line, cache rule, manifest, the
   `favicon.ico` swap, the deletions, `CLAUDE.md`, `check:favicon`. Verify, then merge to
   `master`.
4. `katoptra/site`: drop `favicon.svg` from the shadow-diff list, and decide the
   katoptra.org mark question.
5. Weeks later: the Search Console check.

## Trade-offs accepted

- **No review gate on the consumer.** A push here changes the live favicon with no commit
  on `ijosh.com` and no rollback through its history, within five minutes. Rollback is a
  revert here. This is the point of the design, not a defect in it.
- **Pages deploys on push to `main`, not on tag.** The tag-and-release workflow in
  `release.yml` stays what it is -- a record of versions -- and stops being the gate on
  what is live. Setting `production_branch` to a release branch would restore the gate at
  the cost of the propagation.
- **No immutable caching**, by choice, as above.
- **A cross-origin dependency on the consumer.** A broken build here breaks
  `ijosh.com`'s icons, not `ijosh.com`.
- **`hugo server` renders no icons locally** on the consumer, except the apex
  `favicon.ico`. The visual baselines are unaffected.
- **One file can drift**, guarded by a check.

## Open questions

- `jshvn.com`, `josh.lgbt`, `joshvaughen.com` and the other proxied CNAMEs onto
  `ijosh.com` serve the same page and inherit its `<link>` tags. Their own
  `/favicon.ico` probes resolve against the apex Pages project, which serves the same
  file. Confirm during rollout; no change expected.
