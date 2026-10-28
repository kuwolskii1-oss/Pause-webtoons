#!/usr/bin/env bash
# Slapstick test at base: the three interact1 green-screen gags composited into
# the studio (studio1-wide-1 with a slow push-in), re-timed with tools/snap.py
# for snappy cartoon timing, joined with the Pause ending.
set -euo pipefail
cd "$(dirname "$0")/../../.."
P=plates/studio/studio-wide-push.mp4
O=episodes/tests/interact1
mkdir -p plates/interact1/snap
for gag in capspin hoodie bicker; do
  python3 tools/snap.py plates/interact1/$gag.mp4 plates/interact1/snap/$gag.mp4
  KEY=0x089C44 CH=1080 X=-20 Y=828 SHADOW=0.45 tools/layer.sh $P plates/interact1/snap/$gag.mp4 $O/$gag.mp4 \
    "eq=contrast=1.02:brightness=-0.01:saturation=0.85,colorbalance=rs=0.03:bs=-0.03" \
    $(ffprobe -v error -show_entries format=duration -of csv=p=0 plates/interact1/snap/$gag.mp4)
done
ffmpeg -nostdin -loglevel error -y -i $O/capspin.mp4 -i $O/hoodie.mp4 -i $O/bicker.mp4 \
  -filter_complex "[0:v][1:v][2:v]concat=n=3:v=1:a=0,format=yuv420p[v]" -map "[v]" -r 60 \
  -c:v libx264 -crf 18 -preset slow -movflags +faststart $O/gags-noend.mp4
tools/append-endcard.sh $O/gags-noend.mp4 $O/slapstick-reel.mp4
rm $O/gags-noend.mp4
