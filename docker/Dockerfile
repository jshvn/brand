# The toolbox: librsvg renders, ImageMagick assembles the ICO and resizes the photo,
# node runs the build. Versions are pinned so the committed JPEG bytes survive an image rebuild.
FROM alpine:3.24@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b
RUN apk add --no-cache \
  rsvg-convert=2.62.3-r0 \
  imagemagick=7.1.2.30-r0 \
  imagemagick-jpeg=7.1.2.30-r0 \
  nodejs=24.18.1-r0
WORKDIR /work
