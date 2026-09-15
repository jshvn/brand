#!/bin/sh
# Runs inside the toolbox image. Regenerates the SVGs, then every raster and PDF
# derived from them, then the photo ladder, into the tree given as $1 (default: the
# repo root, so mark/ and photo/ in place).
set -eu
# cairo stamps each PDF with the wall clock unless SOURCE_DATE_EPOCH is set, which
# would make every build dirty the committed PDF. A fixed epoch keeps the PDF
# byte-identical until the SVG behind it changes.
export SOURCE_DATE_EPOCH=0
root="${1:-.}"
out="$root/mark"; pho="$root/photo"
mkdir -p "$out" "$pho"
node src/marks.mjs "$out"

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

# the resume mark, for LaTeX
rsvg-convert -f pdf -o "$out/jshvn-mark-resume.pdf" "$out/jshvn-mark-resume.svg"

# the photo ladder, rendered from the master. Upload forms cap either the pixel size
# or the byte size, so the rungs are spaced to give a choice under both.
[ "$root" = . ] || cp photo/profile.png "$pho"/
for px in 1024 512 400 256 128 64; do
  magick photo/profile.png -resize "${px}x${px}" -strip -quality 85 "$pho/profile-$px.jpg"
done

echo "built $(ls "$out" | wc -l | tr -d ' ') files in $out/ and $(ls "$pho" | wc -l | tr -d ' ') in $pho/"
