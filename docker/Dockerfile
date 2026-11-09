# The toolbox: librsvg renders, ImageMagick assembles the ICO and resizes the photo,
# node runs the build. Versions are pinned so the committed JPEG bytes survive an image rebuild.
# Each apk version names its Alpine 3.24 package on Repology in the comment above it, which is
# how Renovate moves it; an Alpine major moves those names with it, by hand.
FROM alpine:3.24@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6
# renovate: datasource=repology depName=alpine_3_24/rsvg-convert versioning=loose
ARG RSVG_CONVERT_VERSION=2.62.3-r0
# renovate: datasource=repology depName=alpine_3_24/imagemagick versioning=loose
ARG IMAGEMAGICK_VERSION=7.1.2.35-r0
# renovate: datasource=repology depName=alpine_3_24/nodejs versioning=loose
ARG NODEJS_VERSION=24.22.1-r1
RUN apk add --no-cache \
  rsvg-convert="${RSVG_CONVERT_VERSION}" \
  imagemagick="${IMAGEMAGICK_VERSION}" \
  imagemagick-jpeg="${IMAGEMAGICK_VERSION}" \
  nodejs="${NODEJS_VERSION}"
WORKDIR /work
