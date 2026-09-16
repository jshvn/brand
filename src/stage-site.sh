#!/bin/sh
# Stages the site Cloudflare Pages serves at brand.ijosh.com into public/: the index
# page, every committed file in mark/ and photo/, and the headers and robots files
# beside them. Pure copies -- the Pages build image runs this with nothing installed.
set -eu
out="${1:-public}"
rm -rf "$out"
mkdir -p "$out"
cp src/index.html src/_headers src/robots.txt "$out/"
cp -R mark "$out/mark"
cp -R photo "$out/photo"
echo "staged $(find "$out" -type f | wc -l | tr -d ' ') files into $out/"
