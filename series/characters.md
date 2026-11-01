# Pause characters

Original design: **Kim's pencil sketch**, `refs/kim-sketch-original.jpg`. It's the only drawing by Kim so far. Until Kim draws more, the AI sheets in `refs/chars1/` (made from that sketch) are the working reference. Kim's own drawings replace them whenever they exist.

## Kolurin (LEFT in Kim's sketch)
- Short twisted locs on top, faded sides, heavy angry eyebrows, permanently unimpressed.
- Default outfit: oversized plain collared button-up, very baggy wide trousers, chunky sneakers. Outfits can change (see below).
- **Hands in pockets**, almost always, even when kicking things.
- Personality: deadpan, hard to impress, does the physical work. A smile from him is a big moment.
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
- Working references (Kim-style, teen proportions; these win over everything else):
  - **Kuwolskii's face:** `refs/kuwface1/kuwface1-1.jpg`, using the *full front view*, *talking* and *laughing* panels (in *smirk* and the middle figure his cap is backwards).
  - **Kolurin's face:** the left boy in `plates/kf2/kf2-start-2.jpg`, plus Kim's original sketch.
  - Older sheets (`refs/chars1/`, `refs/chars2/`) are for turnarounds and outfits only; their faces drift adult.

## Tone and production (decided)
- **A grounded, mature, sitcom-style series.** Humour comes from character, dialogue and situations, not slapstick or snappy cartoon timing.
- **Production approach: replacement.** Scenes are filmed (or generated) with real people as stand-ins, then the stand-ins are replaced with Kolurin and Kuwolskii, so the characters inherit real lighting, shadows, occlusion, camera moves, acting and lip sync. Best case: the team films themselves performing the dialogue.
- **The 20 fps rule is retired.** The characters move at the footage's natural frame rate so they blend in. `lib/timeline.js` and `tools/snap.py` remain for stylised moments.
- Kim's pencil look is home base (the studio). In other places they are lit by that world but stay recognisably these two.

## Outfits
No logos on clothing, so the two aren't tied to one outfit. They can dress for each universe and episode. What stays fixed is the face, hair, build and habits: Kolurin's locs, fade, brows and hands in pockets; Kuwolskii's cap, locs, goatee and finger gun.
