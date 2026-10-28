#!/usr/bin/env node
/*
 * Render an episode to MP4, frame by frame.
 *
 *   node tools/render.js episodes/01-bean-there [out.mp4] [--fps 30]
 *
   Default 60 fps output: characters animate at 20 fps (each pose held 3
 *   frames), everything else updates every frame. See lib/timeline.js.
 *
 * Opens the episode's index.html with ?render, steps the GSAP timeline with
 * window.renderAt(t) and pipes 1080x1920 screenshots into ffmpeg.
 * Needs Playwright (with Chromium) and ffmpeg on the PATH.
 */
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");

const args = process.argv.slice(2);
const fpsAt = args.indexOf("--fps");
const fps = fpsAt >= 0 ? +args.splice(fpsAt, 2)[1] : 60; // 60 = each 20 fps character frame held exactly 3 frames
const dir = path.resolve(args[0] || "episodes/01-bean-there");
const out = path.resolve(args[1] || path.join(dir, path.basename(dir) + ".mp4"));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on("pageerror", (e) => console.error("page error:", e.message));
  await page.goto("file://" + path.join(dir, "index.html") + "?render");
  await page.evaluate(() => window.ready);
  await page.waitForTimeout(300);
  const duration = await page.evaluate(() => window.DURATION);
  const frames = Math.round(duration * fps);

  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out],
    { stdio: ["pipe", "inherit", "inherit"] });

  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.renderAt(t), i / fps);
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % fps === 0) process.stdout.write(`\r${(i / fps).toFixed(0)}s / ${duration}s`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  await browser.close();
  console.log(`\nwrote ${out}`);
})();
