#!/usr/bin/env bash
# Worlds test: the same test1 character clip dropped into three other realities.
# Each world grades the characters to its own light; the stop-motion world runs
# at 12 fps like real stop-motion, the characters stay at 20 fps everywhere.
set -euo pipefail
cd "$(dirname "$0")/../../.."
C=plates/test1/chars-green.mp4
W=plates/worlds1
O=episodes/tests/worlds1
tools/layer.sh $W/anime.mp4 $C $O/anime.mp4 \
  "eq=contrast=1.06:brightness=0.01:saturation=1.05,colorbalance=rs=0.04:gs=0.01:bs=-0.05" 5
PLATE_FPS=12 SHADOW=0.4 tools/layer.sh $W/stopmotion.mp4 $C $O/stopmotion.mp4 \
  "eq=contrast=1.0:brightness=-0.02:saturation=0.95,colorbalance=rs=0.03:bs=-0.03" 5
SHADOW=0.7 tools/layer.sh $W/noir.mp4 $C $O/noir.mp4 \
  "hue=s=0,eq=contrast=1.3:brightness=-0.2:gamma=0.85" 5

# one reel: real street -> anime -> stop-motion -> noir -> trademark ending
ffmpeg -nostdin -loglevel error -y \
  -i episodes/tests/test1/test1.mp4 -i $O/anime.mp4 -i $O/stopmotion.mp4 -i $O/noir.mp4 \
  -filter_complex "[0:v]trim=0:5,setpts=PTS-STARTPTS[a];[a][1:v][2:v][3:v]concat=n=4:v=1:a=0,format=yuv420p[v]" \
  -map "[v]" -r 60 -c:v libx264 -crf 18 -preset slow -movflags +faststart $O/reel-noend.mp4
tools/append-endcard.sh $O/reel-noend.mp4 $O/worlds-reel.mp4
rm $O/reel-noend.mp4
