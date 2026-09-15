# Rasterizes the SVG marks into PNG, ICO and PDF and the photo master into its JPEG
# ladder. librsvg renders, ImageMagick assembles the multi-size favicon and resizes
# the photo, node runs the SVG generator. Alpine ships each ImageMagick coder as its
# own package: without imagemagick-jpeg, `magick out.jpg` writes a PNG and says
# nothing.
FROM alpine:3.22@sha256:14358309a308569c32bdc37e2e0e9694be33a9d99e68afb0f5ff33cc1f695dce
RUN apk add --no-cache rsvg-convert imagemagick imagemagick-jpeg nodejs
WORKDIR /work
