#!/usr/bin/env bash
# Test 1: Kolurin + Kuwolskii, human-sized, on a real street (cartoon over video).
# Layers, back to front: street plate (24 fps) -> ground shadow -> characters
# (green-screen clip keyed, edge shrunk 2 px to drop the green fringe, held at
# 20 fps). Output 1080x1920 @ 60 fps, so
# every character frame is held exactly 3 frames while the street plays at its
# own rate.
set -euo pipefail
cd "$(dirname "$0")/../../.."
P=plates/test1
OUT=episodes/tests/test1/test1.mp4
KEY=0x00A646          # sampled green of the Kling clip (not quite #00B140)
CH=1168               # character clip height after scaling (human size: heads at eye level)
X=214; Y=655          # top-left of the character layer; feet land around y=1660
DUR=8

ffmpeg -nostdin -y -loglevel error \
  -i $P/plate.mp4 -i $P/chars-green.mp4 \
  -filter_complex "
    [0:v]fps=60,scale=-2:1920:flags=lanczos,crop=1080:1920,setsar=1[bg];
    [1:v]chromakey=$KEY:0.13:0.05,format=rgba,split[k1][k2];
    [k2]alphaextract,erosion,erosion,gblur=sigma=0.7[ka];
    [k1][ka]alphamerge,
         scale=-2:$CH:flags=lanczos,fps=20,tpad=stop_mode=clone:stop_duration=4,
         eq=contrast=1.03:brightness=-0.03:saturation=0.9,format=rgba,split[ch][sh];
    [sh]colorchannelmixer=rr=0:gg=0:bb=0:aa=0.55,scale=iw:ih*0.07,gblur=sigma=10[shadow];
    [bg][shadow]overlay=x=$X:y=$((Y+CH-215)):shortest=0[b1];
    [b1][ch]overlay=x=$X:y=$Y:shortest=0,trim=0:$DUR,format=yuv420p[v]" \
  -map "[v]" -map 0:a? -t $DUR -r 60 -c:v libx264 -crf 18 -preset slow -c:a aac -movflags +faststart $OUT
echo "wrote $OUT"
