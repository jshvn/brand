# The toolbox: librsvg renders, ImageMagick assembles the ICO and resizes the photo,
# node runs the build. Versions are pinned so the committed JPEG bytes survive an image rebuild.
FROM alpine:3.24@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b
RUN apk add --no-cache \
  rsvg-convert=2.60.0-r0 \
  imagemagick=7.1.2.15-r0 \
  imagemagick-jpeg=7.1.2.15-r0 \
  nodejs=22.23.2-r0
WORKDIR /work
