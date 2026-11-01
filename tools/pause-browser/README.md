# Pause Browser

Our own Browserbase: a real Chrome on a computer you own, which any Claude session can drive from anywhere.

**Why at home:** Google and YouTube block browsers running on servers ("Sign in to confirm you're not a bot"). A browser on home internet is treated like a normal person's, so Flow sign-in and YouTube both work. And because it's a real window on your computer, you can watch what it's doing and handle sign-ins and checks yourself.

**Why its own profile:** it uses a separate Chrome profile (`~/.pause-browser`) signed in to a separate Pause Google account, so your personal accounts are never touched.

```
Claude session (cloud) --> tunnel (https, secret key) --> gateway --> Chrome on your computer
```

## One-time setup on the home computer

1. **Install** [Node.js](https://nodejs.org) (LTS) and Google Chrome.
2. **Create the Pause Google account** yourself in a normal browser (Google needs a phone check, and bots aren't allowed to sign up). Optional: a Proton address as its recovery email.
3. **Start Pause Browser** from this repo:
   ```bash
   node tools/pause-browser/server.mjs
   ```
   A new Chrome window opens on Flow. **Sign in with the Pause account there**, once. Leave the terminal open: closing it, or that Chrome window, stops Pause Browser.
4. **Make it reachable** with a free tunnel. Pick one:
   - **Cloudflare Tunnel** (stable address, free): install `cloudflared`, then
     ```bash
     cloudflared tunnel login
     ```
     ```bash
     cloudflared tunnel create pause-browser
     ```
     ```bash
     cloudflared tunnel route dns pause-browser browser.<your-domain>
     ```
     ```bash
     cloudflared tunnel run --url http://127.0.0.1:9333 pause-browser
     ```
   - **Tailscale Funnel** (no domain needed): install Tailscale, then
     ```bash
     tailscale funnel 9333
     ```
5. **Give Claude the address and key**, once: in the Claude cloud environment settings (the environment menu in a session's title bar → Edit), add
   - `PAUSE_BROWSER_URL` = your tunnel address, e.g. `https://browser.<your-domain>`
   - `PAUSE_BROWSER_KEY` = the contents of `~/.pause-browser/pause-browser.key`

   Also allow the tunnel's host in the environment's network settings if it uses an allowlist. New sessions pick these up automatically. **Never paste the key into a chat or commit it.**

## Using it from a session

```js
import { connectPauseBrowser } from "./tools/pause-browser/connect.mjs";
const { browser, page } = await connectPauseBrowser();
await page.goto("https://flow.google.com");
// ... drive Flow, YouTube, anything ...
await browser.close();   // disconnects; Chrome keeps running at home
```

Quick check that a session can reach it: `node tools/pause-browser/connect.mjs` lists the open tabs.

## Safety
- The gateway only listens on `127.0.0.1`; the only way in from outside is the tunnel, and every request needs the key.
- Anyone with the URL **and** key controls a browser signed in to the Pause account. If the key leaks, delete `pause-browser.key` and restart; a new key is created. Then update `PAUSE_BROWSER_KEY`.
- Keep the Pause account separate from anything personal or financial.
