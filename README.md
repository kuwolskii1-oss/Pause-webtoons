# Pause-webtoons
Animation skill: short vertical (1080x1920) marketing animations for Pause, starring the two CISK characters.

- `lib/characters.js` - SVG rigs for both characters (locs kid in the button-up, cap kid in the hoodie), with joints you can animate.
- `episodes/01-bean-there/` - Ep. 01: they rebuild a broken café website. Open `index.html` to watch it in the browser; `01-bean-there.mp4` is the rendered video.
- `tools/render.js` - renders an episode to MP4: `node tools/render.js episodes/01-bean-there` (needs Playwright + ffmpeg).
- `series/pilot-barcelona.md` - pilot script: Kuwolskii (locs) and Kolurin (cap) in real-life Barcelona, plus the footage shot list.
- `tools/composite.js` - draws an animated cartoon shot on a transparent layer and lays it over a real video plate: `node tools/composite.js <shot.html> <plate.mp4> <out.mp4>`.
- `episodes/pilot-barcelona/` - pilot shots; `shot-01-tiles` is the first cartoon-over-video test (Veo clip from Google Flow).
- `tools/rig-preview.html` - both rigs side by side, including the back-view pose from the sketch.
