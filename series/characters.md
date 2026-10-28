# Pause characters

Original design: **Kim's pencil sketch**, `refs/kim-sketch-original.jpg`. It's the only drawing by Kim so far. Until Kim draws more, the AI sheets in `refs/chars1/` (made from that sketch) are the working reference. Kim's own drawings replace them whenever they exist.

## Kolurin (LEFT in Kim's sketch)
- Short twisted locs on top, faded sides, heavy angry eyebrows, permanently unimpressed.
- Oversized collared button-up with **CiSK + cross** on the chest, very baggy wide trousers, chunky sneakers.
- **Hands in pockets**, almost always, even when kicking things.
- Personality: deadpan, hard to impress, does the physical work. A smile from him is a big moment.
- Working references: `chars1-kol-turn-1` (turnaround), `chars1-kol-expr-2` (expressions).
- Code rig: `locs()` in `lib/characters.js` (rig id `lk`).

## Kuwolskii (RIGHT in Kim's sketch, drawn from behind)
- Baseball cap, locs under the cap, oversized hoodie with **CiSK + cross on the hood**, baggy cargo pants with a side pocket, chunky sneakers with a **"0"** on the heel.
- Signature: the **finger gun** with three motion lines **"///"**.
- Personality: playful, first to touch everything, sets off the magic with a "pew".
- Code rig: `cap()` in `lib/characters.js` (rig id `ck`), with a back view for the sketch pose.

### Still to decide (Kuwolskii)
1. Eyes: shaded under the cap brim, or visible? (`chars1-kuw-turn-1` vs `chars1-kuw-face-2`)
2. Cap: forward like Kim's sketch, or backwards?
3. CiSK + cross: on the hood only (as Kim drew it), or on the chest too?
4. Which face becomes the reference.

## Rules in every universe
- **The characters animate at 20 fps**: held frames, like hand-drawn animation, whatever world they're in. The world (footage, props, UI, camera moves) runs at its own frame rate. In code, `lib/timeline.js` enforces this. Final renders are 60 fps, so each character pose is held for exactly 3 frames.
- Kim's pencil look is home base. In other universes they take on that world's light and shadows (and later maybe its style), but stay recognisably these two.

## Open question
"Cisk" is also the name of a real Maltese beer brand (Simonds Farsons Cisk). Check whether that matters before the characters appear in public marketing or merch.
