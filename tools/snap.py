#!/usr/bin/env python3
"""
Re-time an AI character clip for snappy cartoon timing.

    python3 tools/snap.py in.mp4 out.mp4 [--action 2.2] [--idle 3.5] [--hold 4]
                                          [--holds 1.2,3.4] [--trim 0.3-4.8]

AI video models ease every move, which reads as slow motion. This keeps the
drawings but changes *when* they appear:
  - frames with a lot of movement play at --action x speed (fast moves),
  - frames with little movement play at --idle x speed (no floaty drift),
  - at each "hit" (a burst of motion that suddenly stops: impact, landing,
    end of a gesture) the pose is held for --hold frames,
  - --holds adds extra holds at given source times (seconds), e.g. on a
    reaction face,
  - --trim keeps only part of the source clip,
  - --tail holds the final pose so the gag lands (seconds, default 0.6).
Output is at 20 fps (the characters' frame rate), same size and green screen
as the input, ready for tools/layer.sh.
"""
import argparse, json, os, subprocess, sys, tempfile
import numpy as np

OUT_FPS = 20


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
                          "stream=width,height,r_frame_rate", "-of", "json", path],
                         capture_output=True, text=True, check=True).stdout
    s = json.loads(out)["streams"][0]
    num, den = s["r_frame_rate"].split("/")
    return s["width"], s["height"], float(num) / float(den)


def motion_curve(path, w=180, h=320):
    raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", path, "-vf", f"scale={w}:{h},format=gray",
                          "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    frames = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)
    m = np.zeros(len(frames))
    m[1:] = np.abs(np.diff(frames, axis=0)).mean(axis=(1, 2))
    m = np.convolve(m, np.ones(3) / 3, mode="same")          # smooth single-frame noise
    return m / (np.percentile(m, 95) + 1e-6), len(frames)


def plan(m, fps, action, idle, hold, extra_holds, start, end):
    """Return the source frame index for every 20 fps output frame."""
    hits, last = set(), -99
    gap = int(0.4 * fps)                                         # at most one hit per 0.4 s
    for i in range(2, len(m) - 4):
        peak = m[i] > 0.8 and m[i] >= m[i - 1] and m[i] >= m[i + 1]
        if peak and min(m[i + 1:i + 5]) < 0.55 * m[i] and i - last >= gap:
            hits.add(i + 2)                                      # the pose right after the burst
            last = i
    hits |= {int(round(t * fps)) for t in extra_holds}
    out, pos, held = [], float(start), set()
    step = fps / OUT_FPS                                         # source frames per output frame at 1x
    while pos < end:
        i = int(pos)
        out.append(i)
        for hit in [h for h in hits if h not in held and h <= i]:
            out += [i] * hold
            held.add(hit)
        speed = action if m[min(i, len(m) - 1)] >= 0.25 else idle
        pos += step * speed
    return out, sorted(hits)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src"); ap.add_argument("dst")
    ap.add_argument("--action", type=float, default=2.2)
    ap.add_argument("--idle", type=float, default=3.5)
    ap.add_argument("--hold", type=int, default=4)
    ap.add_argument("--holds", default="", help="extra hold times in source seconds, comma separated")
    ap.add_argument("--trim", default="", help="source range in seconds, e.g. 0.3-4.8")
    ap.add_argument("--tail", type=float, default=0.6, help="hold on the last pose, seconds")
    a = ap.parse_args()

    w, h, fps = probe(a.src)
    m, n = motion_curve(a.src)
    start, end = 0, n
    if a.trim:
        t0, t1 = (float(x) for x in a.trim.split("-"))
        start, end = int(t0 * fps), min(n, int(t1 * fps))
    extra = [float(x) for x in a.holds.split(",") if x]
    frames, hits = plan(m, fps, a.action, a.idle, a.hold, extra, start, end)
    frames += [frames[-1]] * int(a.tail * OUT_FPS)

    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", a.src, os.path.join(tmp, "f%04d.png")], check=True)
        with open(os.path.join(tmp, "list.txt"), "w") as f:
            for i in frames:
                f.write(f"file 'f{i + 1:04d}.png'\nduration {1 / OUT_FPS}\n")
            f.write(f"file 'f{frames[-1] + 1:04d}.png'\n")
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i",
                        os.path.join(tmp, "list.txt"), "-r", str(OUT_FPS), "-c:v", "libx264", "-crf", "12",
                        "-pix_fmt", "yuv420p", a.dst], check=True)
    print(f"{a.src}: {n / fps:.2f}s -> {len(frames) / OUT_FPS:.2f}s at {OUT_FPS} fps, "
          f"holds at {[round(x / fps, 2) for x in hits]}s")


if __name__ == "__main__":
    sys.exit(main())
