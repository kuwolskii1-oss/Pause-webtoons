/*
 * Connect to Pause Browser from any session.
 *
 *   import { connectPauseBrowser } from "./tools/pause-browser/connect.mjs";
 *   const { browser, page } = await connectPauseBrowser();
 *   await page.goto("https://flow.google.com");
 *   ...
 *   await browser.close();   // disconnects only; Chrome keeps running at home
 *
 * Reads PAUSE_BROWSER_URL (the tunnel address, e.g. https://browser.example.com)
 * and PAUSE_BROWSER_KEY (from pause-browser.key on the home computer), which
 * are set once in the Claude environment settings so every new session has
 * them. Never commit the key.
 *
 * Also a quick check from the command line:
 *   node tools/pause-browser/connect.mjs   -> prints the open tabs
 */
import { createRequire } from "node:module";

// Use the project's Playwright if installed, otherwise a global one.
const { chromium } = await import("playwright").catch(() => createRequire(import.meta.url)("playwright"));

export async function connectPauseBrowser({ url = process.env.PAUSE_BROWSER_URL, key = process.env.PAUSE_BROWSER_KEY } = {}) {
  if (!url || !key) throw new Error("Set PAUSE_BROWSER_URL and PAUSE_BROWSER_KEY (Claude environment settings).");
  const browser = await chromium.connectOverCDP(url, { headers: { "x-pause-key": key }, timeout: 30000 });
  const context = browser.contexts()[0];               // the persistent, signed-in profile
  const page = context.pages()[0] || (await context.newPage());
  return { browser, context, page };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { browser, context } = await connectPauseBrowser();
  for (const p of context.pages()) console.log(`${await p.title()}  ${p.url()}`);
  await browser.close();
}
