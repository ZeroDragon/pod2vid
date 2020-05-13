#!/bin/bash

font_family="FiraCode-Regular.ttf"

for file in *.mp3; 
do
  title=""
  filename=${file%%.*}
  image="${filename}.png"

  ffmpeg -y -i "$file" -i "$image" -filter_complex \
  "[1:v]scale=w=1280:h=720,pad=1280:720:0:0[image]; \
   [0:a]showwaves=s=1280x200:mode=cline:colors=#740165[sw]; \
   [image][sw]overlay=0:550[out]" \
  -map "[out]" -map 0:a -c:v libx264 -preset fast -c:a aac -b:a 128k "${filename}.mp4"

done