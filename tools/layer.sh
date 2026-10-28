#!/usr/bin/env bash
# Composite a green-screen character clip over a world plate.
#
#   tools/layer.sh <plate.mp4> <chars-green.mp4> <out.mp4> [grade] [duration]
#
# Layers, back to front: plate (keeps its own frame rate) -> ground shadow ->
# characters (keyed, edge shrunk 2 px to drop the green fringe, held at 20 fps).
# Output is 1080x1920 at 60 fps, so every character frame is held exactly
# 3 frames.
#
# grade: extra ffmpeg filters applied to the characters only, so they take on
# the world's light, e.g. "hue=s=0,eq=contrast=1.25:brightness=-0.12" for noir.
#
# Placement env vars (defaults fit the test1 street layout):
#   KEY=0x00A646  key colour     CH=1168  character layer height
#   X=214 Y=655   layer top-left SHADOW=0.55  shadow opacity
#   PLATE_FPS     force the world's own frame rate, e.g. 12 for stop-motion
set -euo pipefail
PLATE=$1 CHARS=$2 OUT=$3
GRADE=${4:-"eq=contrast=1.03:brightness=-0.03:saturation=0.9"}
DUR=${5:-8}
KEY=${KEY:-0x00A646} CH=${CH:-1168} X=${X:-214} Y=${Y:-655} SHADOW=${SHADOW:-0.55}
PLATE_RATE=${PLATE_FPS:+fps=$PLATE_FPS,}

ffmpeg -nostdin -y -loglevel error \
  -i "$PLATE" -i "$CHARS" \
  -filter_complex "
    [0:v]${PLATE_RATE}scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,setsar=1,fps=60[bg];
    [1:v]chromakey=$KEY:0.13:0.05,format=rgba,split[k1][k2];
    [k2]alphaextract,erosion,erosion,gblur=sigma=0.7[ka];
    [k1][ka]alphamerge,
         scale=-2:$CH:flags=lanczos,fps=20,tpad=stop_mode=clone:stop_duration=10,
         $GRADE,format=rgba,split[ch][sh];
    [sh]colorchannelmixer=rr=0:gg=0:bb=0:aa=$SHADOW,scale=iw:ih*0.07,gblur=sigma=10[shadow];
    [bg][shadow]overlay=x=$X:y=$((Y + CH - 215)):shortest=0[b1];
    [b1][ch]overlay=x=$X:y=$Y:shortest=0,trim=0:$DUR,format=yuv420p[v]" \
  -map "[v]" -map "0:a?" -t "$DUR" -r 60 -c:v libx264 -crf 18 -preset slow -c:a aac -movflags +faststart "$OUT"
echo "wrote $OUT"
