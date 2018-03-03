#!/bin/bash
A4_WIDTH_INCHES="8.27"
A4_HEIGHT_INCHES="11.7"
DPI=300

A4_WIDTH_PIXELS=$(echo "${A4_WIDTH_INCHES}*${DPI}" | bc)
A4_HEIGHT_PIXELS=$(echo "${A4_HEIGHT_INCHES}*${DPI}" | bc)

node ../index.js -r weasyprint example.md example.pdf
convert -density "${DPI}" example.pdf -extent "${A4_WIDTH_PIXELS}x${A4_HEIGHT_PIXELS}"\
    \( +clone -background black -shadow 75x10+0+0 \)\
    +swap  -background none -layers merge +repage\
    example.png
