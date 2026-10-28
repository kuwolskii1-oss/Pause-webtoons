# Pause characters

Original design: **Kim's pencil sketch**, `refs/kim-sketch-original.jpg`. It's the only drawing by Kim so far. Until Kim draws more, the AI sheets in `refs/chars1/` (made from that sketch) are the working reference. Kim's own drawings replace them whenever they exist.

## Kolurin (LEFT in Kim's sketch)
- Short twisted locs on top, faded sides, heavy angry eyebrows, permanently unimpressed.
- Default outfit: oversized plain collared button-up, very baggy wide trousers, chunky sneakers. Outfits can change (see below).
- **Hands in pockets**, almost always, even when kicking things.
- Personality: deadpan, hard to impress, does the physical work. A smile from him is a big moment.
- Working references: `chars1-kol-turn-1` (turnaround), `chars1-kol-expr-2` (expressions).
- Code rig: `locs()` in `lib/characters.js` (rig id `lk`).

## Kuwolskii (RIGHT in Kim's sketch, drawn from behind)
- Baseball cap, locs under the cap, a small **goatee**, eyes visible under the brim (relaxed, half-lidded).
- Default outfit: oversized plain hoodie, baggy cargo pants with a side pocket, chunky sneakers. Outfits can change.
- **Cap direction:** forward or backward, but the same for a whole video.
- Signature: the **finger gun** with three motion lines **"///"**.
- Personality: playful, first to touch everything, sets off the magic with a "pew".
- Code rig: `cap()` in `lib/characters.js` (rig id `ck`), with a back view for the sketch pose.

### Decided
- No logos or text on any clothes, ever. The original CiSK + cross is dropped.
- Goatee: yes. Eyes: visible under the brim.
- Working references: `refs/chars2/`. Kuwolskii: `chars2-kuw-turn-2` (cap forward in every view), `chars2-kuw-outfits-1`, `chars2-kuw-expr-2`. Kolurin: `chars2-kol-turn-1`, `chars2-kol-outfits-1`.

## Rules in every universe
- **The characters animate at 20 fps**: held frames, like hand-drawn animation, whatever world they're in. The world (footage, props, UI, camera moves) runs at its own frame rate. In code, `lib/timeline.js` enforces this. Final renders are 60 fps, so each character pose is held for exactly 3 frames.
- Kim's pencil look is home base. In other universes they take on that world's light and shadows (and later maybe its style), but stay recognisably these two.

## Outfits
No logos on clothing, so the two aren't tied to one outfit. They can dress for each universe and episode. What stays fixed is the face, hair, build and habits: Kolurin's locs, fade, brows and hands in pockets; Kuwolskii's cap, locs, goatee and finger gun.
