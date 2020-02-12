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
   [image][sw]overlay=0:H-h,drawtext=text=${title}:fontcolor=#740165:fontsize=0:x=(W-tw)/2+2:y=H-200-th+2:fix_bounds=true:fontfile=$font_family[out]" \
  -map "[out]" -map 0:a -c:v libx264 -preset fast -crf 18 -c:a copy "${filename}.mkv"

done