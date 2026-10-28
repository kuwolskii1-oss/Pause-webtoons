#!/usr/bin/env bash
# Add the Pause trademark ending to a video.
#
#   tools/append-endcard.sh <in.mp4> <out.mp4>
#
# Grabs the video's last frame, renders brand/endcard with it (pause hit ->
# freeze -> end card) and joins the two at 1080x1920, 60 fps. Audio from the
# input is kept; the end card is silent.
set -euo pipefail
IN=$(realpath "$1") OUT=$(realpath -m "$2")
ROOT=$(cd "$(dirname "$0")/.." && pwd)
TMP=$(mktemp -d) && trap 'rm -rf "$TMP"' EXIT

ffmpeg -nostdin -loglevel error -sseof -0.1 -i "$IN" -update 1 -frames:v 1 "$ROOT/brand/endcard/frame.png" -y
node "$ROOT/tools/render.js" "$ROOT/brand/endcard" "$TMP/end.mp4" --query "frame=frame.png" > /dev/null
rm -f "$ROOT/brand/endcard/frame.png"

ffmpeg -nostdin -loglevel error -y -i "$IN" -i "$TMP/end.mp4" -f lavfi -t 0.1 -i anullsrc=r=48000:cl=stereo \
  -filter_complex "
    [0:v]scale=1080:1920,fps=60,setsar=1,format=yuv420p[v0];
    [1:v]scale=1080:1920,fps=60,setsar=1,format=yuv420p[v1];
    [0:a]aresample=48000,aformat=channel_layouts=stereo[a0];
    [2:a]apad=whole_dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TMP/end.mp4")[a1];
    [v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset slow -c:a aac -movflags +faststart "$OUT" 2>/dev/null \
|| ffmpeg -nostdin -loglevel error -y -i "$IN" -i "$TMP/end.mp4" \
  -filter_complex "[0:v]scale=1080:1920,fps=60,setsar=1,format=yuv420p[v0];[1:v]scale=1080:1920,fps=60,setsar=1,format=yuv420p[v1];[v0][v1]concat=n=2:v=1:a=0[v]" \
  -map "[v]" -c:v libx264 -crf 18 -preset slow -movflags +faststart "$OUT"
echo "wrote $OUT"
