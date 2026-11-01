# Pause: series concept (working)

## Format
- **YouTube only**, horizontal **16:9** (1920×1080), about **3 minutes** per episode.
- **No voices for now.** Visual storytelling plus captions/on-screen text until a voice model is chosen (the team's own cloned voices are the likely plan).
- Tone: **grounded, mature, sitcom-like.** Humour from character and situation, not slapstick.

## The show
Kolurin and Kuwolskii run Pause, a web design studio. Each episode they travel into another **reality** (anime, noir, stop-motion, real-world cities, games, paintings: any style), live in it, learn something about how art and design work there, then come back to **home base** and turn it into a design for a client.

- **Home base:** a world of its own, still undecided. The pencil sketchbook studio is one option, not a requirement.
- **What sends them there: undecided.** Inspired by *Link Click* (clients bring a photo and the duo jumps into the moment it was taken) and the *Magic Key* books.

### Premise candidate: "the paused moment"
- A client brings a **frozen moment** they love: an old photo, a poster, a game screenshot, a painting, a film still.
- The duo **pause** it and **step inside** that world. They can stay only until the moment unpauses, which gives each episode a built-in clock.
- They come back and build the client's site or brand from what they experienced. Each episode ends with a **before/after**, so every episode is also a portfolio piece.
- Line: *"We pause the moment you love, step inside, and bring it back as your brand."*

## Production
- **Replacement workflow:** generate a live-action (or any-style) scene with stand-ins, then replace the stand-ins with Kolurin and Kuwolskii, so they inherit the scene's lighting, shadows, occlusion and camera. See `series/characters.md`.
- Generators: the Kie relay (many models via one account, credits) and Google Flow (free daily credits through the team's own browser, using the Claude in Chrome extension or the desktop app's built-in browser).
- Every episode ends with the **Pause trademark ending** (`tools/append-endcard.sh`), to be converted to 16:9.
