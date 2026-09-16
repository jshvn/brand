# The toolbox: librsvg renders, ImageMagick assembles the ICO and resizes the photo,
# node runs the build. Versions are pinned so the committed JPEG bytes survive an image rebuild.
FROM alpine:3.22@sha256:14358309a308569c32bdc37e2e0e9694be33a9d99e68afb0f5ff33cc1f695dce
RUN apk add --no-cache \
  rsvg-convert=2.60.0-r0 \
  imagemagick=7.1.2.15-r0 \
  imagemagick-jpeg=7.1.2.15-r0 \
  nodejs=22.23.2-r0
WORKDIR /work
