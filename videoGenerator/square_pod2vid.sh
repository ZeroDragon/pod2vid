#!/bin/bash

font_family="FiraCode-Regular.ttf"

for file in *.mp3; 
do
  title=""
  filename=${file%%.*}
  image="${filename}.png"

  ffmpeg -y -i "$file" -i "$image" -filter_complex \
  "
   [1:v]scale=w=500:h=500,pad=500:500:0:0[image]; \
   [0:a]showwaves=s=400x200:colors=730067:mode=cline[sw]; \
   [image][sw]overlay=50:250[out]" \
  -map "[out]" -map 0:a -c:v libx264 -preset fast -c:a aac -b:a 128k "${filename}.mp4"

done
