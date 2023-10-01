#!/bin/sh
jekyll serve --watch &
sleep 3
(cd _site; npx lite-server .)
# (cd _site; npx browser-sync start --server --files "./**/*.*" --reload-delay 1000)
# npx browser-sync start --proxy "localhost:4000" --files "_site/**/*.*" --reload-delay 1000
