/*
 * Two-speed timeline: the cast always animates at CHAR_FPS (20 fps, held
 * frames like hand-drawn animation) while the world around them - plates,
 * UI, props, effects - plays at whatever frame rate the output uses.
 *
 *   const { tl, renderAt } = PauseTimeline.create();
 *   tl.to("#lk-armR", {...}, 1.2);   // character part -> stepped at 20 fps
 *   tl.to("#nav", {...}, 1.2);       // anything else  -> smooth
 *   renderAt(t);                     // seek both
 *
 * A tween goes to the character timeline when its target is a selector for
 * a rig part ("#lk...", "#ck..."), or an array containing one.
 */
(function (global) {
  const CHAR_FPS = 20;

  function create({ cast = ["lk", "ck"], charFps = CHAR_FPS } = {}) {
    const world = gsap.timeline({ paused: true });
    const chars = gsap.timeline({ paused: true });
    const re = new RegExp(`^#(${cast.join("|")})(-|$)`);
    const isCast = (target) => (Array.isArray(target) ? target : [target])
      .some((x) => typeof x === "string" && re.test(x));

    const tl = {};
    ["to", "from", "fromTo", "set"].forEach((m) => {
      tl[m] = (target, ...rest) => { (isCast(target) ? chars : world)[m](target, ...rest); return tl; };
    });

    // The cast only changes on 20 fps boundaries; the epsilon keeps exact
    // frame times (e.g. 0.15 * 20) from rounding down a frame.
    const step = (t) => Math.floor(t * charFps + 1e-6) / charFps;
    function renderAt(t) {
      world.time(t, false);
      chars.time(step(t), false);
    }
    return { tl, renderAt, step, world, chars, charFps };
  }

  global.PauseTimeline = { create, CHAR_FPS };
})(window);
