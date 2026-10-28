#!/usr/bin/env node
/*
 * Composite an animated cartoon layer over a real video plate.
 *
 *   node tools/composite.js <shot.html> <plate.mp4> <out.mp4> [--fps 24]
 *
 * The shot page must expose window.ready, window.renderAt(t) and
 * window.DURATION, and render on a transparent background when opened with
 * ?render (same contract as the episode pages). Frames are captured as
 * transparent PNGs and laid over the plate (scaled to 1080x1920) by ffmpeg.
 */
const { chromium } = require("playwright");
const { spawnSync } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");

const args = process.argv.slice(2);
const fpsAt = args.indexOf("--fps");
const fps = fpsAt >= 0 ? +args.splice(fpsAt, 2)[1] : 60; // characters stay at 20 fps; the plate keeps its own rate
const [shot, plate, out] = args.map((a) => path.resolve(a));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pause-layer-"));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on("pageerror", (e) => console.error("page error:", e.message));
  await page.goto("file://" + shot + "?render");
  await page.evaluate(() => window.ready);
  const duration = await page.evaluate(() => window.DURATION);
  const frames = Math.round(duration * fps);
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.renderAt(t), i / fps);
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(5, "0")}.png`), omitBackground: true });
  }
  await browser.close();
  const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error",
    "-i", plate, "-framerate", String(fps), "-i", path.join(dir, "f%05d.png"),
    "-filter_complex", `[0:v]fps=${fps},scale=1080:1920:flags=lanczos,setsar=1[bg];[bg][1:v]overlay=0:0:shortest=1,format=yuv420p[v]`,
    "-map", "[v]", "-map", "0:a?", "-t", String(duration), "-c:v", "libx264", "-crf", "18", "-c:a", "aac", "-movflags", "+faststart", out],
    { stdio: "inherit" });
  fs.rmSync(dir, { recursive: true, force: true });
  if (r.status) process.exit(r.status);
  console.log("wrote " + out);
})();
