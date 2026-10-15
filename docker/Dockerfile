# The toolbox: librsvg renders, ImageMagick assembles the ICO and resizes the photo,
# node runs the build. Versions are pinned so the committed JPEG bytes survive an image rebuild.
FROM alpine:3.24@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6
RUN apk add --no-cache \
  rsvg-convert=2.62.3-r0 \
  imagemagick=7.1.2.30-r0 \
  imagemagick-jpeg=7.1.2.30-r0 \
  nodejs=24.18.1-r0
WORKDIR /work
