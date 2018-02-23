#!/bin/bash
A4_WIDTH_INCHES="8.27"
A4_HEIGHT_INCHES="11.7"
DPI=500

A4_WIDTH_PIXELS=$(echo "${A4_WIDTH_INCHES}*${DPI}" | bc)
A4_HEIGHT_PIXELS=$(echo "${A4_HEIGHT_INCHES}*${DPI}" | bc)

node ../index.js example.md example.pdf
convert -density "${DPI}" -extent "${A4_WIDTH_PIXELS}x${A4_HEIGHT_PIXELS}" example.pdf example.png
