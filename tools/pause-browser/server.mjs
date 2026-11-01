#!/usr/bin/env node
/*
 * Pause Browser: our own Browserbase, running on a computer you own.
 *
 *   node tools/pause-browser/server.mjs [--port 9333] [--profile ~/.pause-browser]
 *
 * Starts a real Chrome window with its OWN profile (separate from your
 * personal Chrome), and a small gateway in front of Chrome's remote-control
 * port that only lets in requests carrying the secret key. Put a tunnel
 * (Cloudflare or Tailscale, see README.md) in front of the gateway and any
 * Claude session can drive this browser from anywhere:
 *
 *   const browser = await chromium.connectOverCDP(URL, { headers: { "x-pause-key": KEY } })
 *
 * Because it runs on home internet, Google and YouTube treat it like a normal
 * person's browser, and you can watch the window and sign in yourself.
 * No dependencies beyond Node 18+ and Google Chrome.
 */
import { spawn } from "node:child_process";
import { randomBytes, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";

const arg = (name, def) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
};
const PORT = +arg("--port", 9333);
const CDP_PORT = PORT + 1;                       // Chrome's own port, localhost only
const PROFILE = path.resolve(arg("--profile", path.join(os.homedir(), ".pause-browser")).replace(/^~/, os.homedir()));

// --- the secret key: created once, kept next to the profile ---------------
fs.mkdirSync(PROFILE, { recursive: true });
const keyFile = path.join(PROFILE, "pause-browser.key");
if (!fs.existsSync(keyFile)) fs.writeFileSync(keyFile, randomBytes(24).toString("base64url"), { mode: 0o600 });
const KEY = Buffer.from(fs.readFileSync(keyFile, "utf8").trim());
const keyOk = (h) => {
  const got = Buffer.from(String(h || ""));
  return got.length === KEY.length && timingSafeEqual(got, KEY);
};

// --- start Chrome with its own profile ------------------------------------
function findChrome() {
  const candidates = {
    darwin: ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"],
    win32: [
      path.join(process.env["PROGRAMFILES"] || "", "Google/Chrome/Application/chrome.exe"),
      path.join(process.env["PROGRAMFILES(X86)"] || "", "Google/Chrome/Application/chrome.exe"),
      path.join(process.env.LOCALAPPDATA || "", "Google/Chrome/Application/chrome.exe"),
    ],
    linux: ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser"],
  }[process.platform] || [];
  return process.env.CHROME_PATH || candidates.find((p) => p && fs.existsSync(p));
}
const chromePath = findChrome();
if (!chromePath) {
  console.error("Couldn't find Google Chrome. Install it, or set CHROME_PATH.");
  process.exit(1);
}
const chrome = spawn(chromePath, [
  `--user-data-dir=${path.join(PROFILE, "chrome")}`,
  `--remote-debugging-port=${CDP_PORT}`,
  "--remote-debugging-address=127.0.0.1",
  "--no-first-run",
  "--no-default-browser-check",
  "--restore-last-session",
  ...(process.env.PAUSE_BROWSER_HEADLESS ? ["--headless=new"] : []),   // only for testing without a screen
  ...(process.getuid?.() === 0 ? ["--no-sandbox"] : []),               // Chrome refuses to run as root otherwise
  "https://flow.google.com",
], { stdio: "ignore" });
chrome.on("exit", (code) => { console.log(`Chrome closed (${code}). Stopping.`); process.exit(0); });
process.on("SIGINT", () => { chrome.kill(); process.exit(0); });

// --- the gateway: check the key, then pass traffic to Chrome --------------
const publicBase = (req) => {
  const proto = req.headers["x-forwarded-proto"] === "https" ? "wss" : "ws";
  return `${proto}://${req.headers["x-forwarded-host"] || req.headers.host}`;
};

const server = http.createServer((req, res) => {
  if (req.url === "/health") { res.end("ok"); return; }   // no key needed, says nothing
  if (!keyOk(req.headers["x-pause-key"])) { res.writeHead(401).end("missing or wrong x-pause-key"); return; }
  const up = http.request({ host: "127.0.0.1", port: CDP_PORT, path: req.url, method: req.method,
                            headers: { ...req.headers, host: `127.0.0.1:${CDP_PORT}` } }, (r) => {
    let body = "";
    r.on("data", (c) => (body += c));
    r.on("end", () => {
      // Chrome advertises ws://127.0.0.1:<port>/...; point clients at the tunnel instead
      body = body.replaceAll(`ws://127.0.0.1:${CDP_PORT}`, publicBase(req));
      res.writeHead(r.statusCode, { "content-type": r.headers["content-type"] || "application/json" });
      res.end(body);
    });
  });
  up.on("error", () => res.writeHead(502).end("Chrome isn't ready yet"));
  req.pipe(up);
});

server.on("upgrade", (req, socket, head) => {
  if (!keyOk(req.headers["x-pause-key"])) { socket.end("HTTP/1.1 401 Unauthorized\r\n\r\n"); return; }
  const up = net.connect(CDP_PORT, "127.0.0.1", () => {
    const headers = Object.entries({ ...req.headers, host: `127.0.0.1:${CDP_PORT}`, origin: undefined })
      .filter(([k, v]) => v !== undefined && k !== "x-pause-key")
      .map(([k, v]) => `${k}: ${v}`).join("\r\n");
    up.write(`${req.method} ${req.url} HTTP/1.1\r\n${headers}\r\n\r\n`);
    if (head?.length) up.write(head);
    socket.pipe(up).pipe(socket);
  });
  up.on("error", () => socket.destroy());
  socket.on("error", () => up.destroy());
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Pause Browser is running.
  Chrome profile: ${path.join(PROFILE, "chrome")}
  Gateway:        http://127.0.0.1:${PORT}  (point your tunnel here)
  Secret key:     stored in ${keyFile}
Keep this window open. Sign in to the Pause Google account in the Chrome window that opened.`);
});
