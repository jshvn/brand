#!/bin/sh
# Runs inside the toolbox image. src/build.mjs writes every generated text file -- the
# SVGs in mark/ and social/, and tokens.css -- and the rest of this script renders what
# needs librsvg or ImageMagick: the PNGs, the ICO, the PDFs, the photo ladder and the
# share image. All of it lands in the tree given as $1, default the repo root.
set -eu
# cairo stamps each PDF with the wall clock unless SOURCE_DATE_EPOCH is set, which
# would make every build dirty the committed PDF. A fixed epoch keeps the PDF
# byte-identical until the SVG behind it changes.
export SOURCE_DATE_EPOCH=0
root="${1:-.}"
out="$root/mark"; soc="$root/social"; pho="$root/photo"; shr="$root/share"
mkdir -p "$pho"
node src/build.mjs "$root"

png() { rsvg-convert -w "$3" -h "$3" -o "$out/$2" "$out/$1"; }
png jshvn-mark-on-light.svg        jshvn-mark-on-light-1024.png        1024
png jshvn-mark-on-light.svg        jshvn-mark-on-light-512.png         512
png jshvn-mark-on-dark.svg         jshvn-mark-on-dark-1024.png         1024
png jshvn-mark-on-dark.svg         jshvn-mark-on-dark-512.png          512
png jshvn-mark-solid-on-light.svg  jshvn-mark-solid-on-light-512.png   512
png jshvn-mark-solid-on-dark.svg   jshvn-mark-solid-on-dark-512.png    512
png jshvn-icon.svg                 jshvn-icon-1024.png                 1024
png jshvn-icon.svg                 jshvn-icon-512.png                  512
png jshvn-icon-square.svg          apple-touch-icon-180.png            180
png jshvn-icon-square.svg          jshvn-icon-square-512.png           512
png jshvn-icon-maskable.svg        jshvn-icon-maskable-192.png         192
png jshvn-icon-maskable.svg        jshvn-icon-maskable-512.png         512
png jshvn-icon-circle.svg          jshvn-icon-circle-1024.png          1024
png jshvn-icon-solid.svg           favicon-16.png                      16
png jshvn-icon-solid.svg           favicon-32.png                      32
png jshvn-icon.svg                 favicon-48.png                      48

# favicon.ico: the solid tile at 16 and 32, the two-tone tile at 48
magick "$out/favicon-16.png" "$out/favicon-32.png" "$out/favicon-48.png" "$out/favicon.ico"
rm "$out/favicon-16.png" "$out/favicon-32.png" "$out/favicon-48.png"

# A PDF of every mark form, for page layouts, LaTeX, and print vendors, so
# nobody has to export one. The containers get none: a tile is a screen surface.
# The resume pair carries the print greys, two tones for the mark set beside a
# name and one tone for icon size, where the lighter cells would drop out.
pdf() { rsvg-convert -f pdf -o "$out/$1.pdf" "$out/$1.svg"; }
pdf jshvn-mark-on-light
pdf jshvn-mark-on-dark
pdf jshvn-mark-solid-on-light
pdf jshvn-mark-solid-on-dark
pdf jshvn-mark-resume
pdf jshvn-mark-solid-resume

# Everything in social/: the profile banners and the GitHub repo social preview. Each
# PNG is named for the pixels it holds, because that is the number an upload form asks
# for, and the size is read back out of the SVG it came from so the platform table in
# src/social.mjs stays the only place those numbers live. A new row there needs no edit
# here, whatever it is called.
for svg in "$soc"/*.svg; do
  base=$(basename "$svg" .svg)
  size=$(sed -n '1s/^<svg[^>]*width="\([0-9]*\)" height="\([0-9]*\)".*/\1x\2/p' "$svg")
  [ -n "$size" ] || { echo "no size in $svg" >&2; exit 1; }
  rsvg-convert -o "$soc/$base-$size.png" "$svg"
done

# the photo ladder, rendered from the master. Upload forms cap either the pixel size
# or the byte size, so the rungs are spaced to give a choice under both.
[ "$root" = . ] || cp photo/profile.png "$pho"/
for px in 1024 512 400 256 128 64; do
  magick photo/profile.png -resize "${px}x${px}" -strip -quality 85 "$pho/profile-$px.jpg"
done

# The share image: the picture a link to ijosh.com unfurls with. src/share.mjs draws the
# charcoal half and the photo master takes the square beside it. JPEG, because a 1200x630
# PNG carrying a photograph runs past a megabyte, and every consumer of an og:image takes
# a JPEG. Both intermediates go: neither is a picture anyone should be served.
rsvg-convert -o "$shr/jshvn-share.png" "$shr/jshvn-share.svg"
magick "$shr/jshvn-share.png" \
  \( photo/profile.png -resize 630x630 \) -geometry +0+0 -composite \
  -strip -quality 85 "$shr/jshvn-share-1200x630.jpg"
rm "$shr/jshvn-share.png" "$shr/jshvn-share.svg"

n() { ls "$1" | wc -l | tr -d ' '; }
echo "built $(n "$out") files in $out/, $(n "$soc") in $soc/, $(n "$pho") in $pho/ and $(n "$shr") in $shr/"
