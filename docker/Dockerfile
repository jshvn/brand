# The toolbox: librsvg renders, ImageMagick assembles the ICO and resizes the photo,
# node runs the build. Versions are pinned so the committed JPEG bytes survive an image rebuild.
FROM alpine:3.24@sha256:be2656061b536c1883c4034790e21d0a09c5aaaf51968b89368a3c0371ea2c9a
RUN apk add --no-cache \
  rsvg-convert=2.62.3-r0 \
  imagemagick=7.1.2.30-r0 \
  imagemagick-jpeg=7.1.2.30-r0 \
  nodejs=24.18.1-r0
WORKDIR /work
