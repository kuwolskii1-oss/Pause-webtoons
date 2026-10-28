/*
 * Pause character rigs, drawn from the CISK pencil sketch.
 *
 *   locs()  - KUWOLSKII, the kid in the CISK button-up: twisted locs, fade, heavy
 *             brows, permanent unimpressed look, hands in pockets.
 *   cap()   - KOLURIN, the kid in the cap and CISK hoodie: locs under the cap,
 *             cargo pants, signature finger gun with "///" lines.
 *             Has a back view (hood with CISK + cross) for the sketch pose.
 *
 * Each builder returns SVG markup at "scale 1" (about 640 units tall) with
 * the feet centred on (0,0) and "up" being -y. Every movable part sits in a
 * group whose pivot is its own (0,0), so rotate it with { svgOrigin: "0 0" }.
 *
 * Part ids (prefix = the id you pass in):
 *   prefix              outer group - position with gsap x / y only
 *   prefix-pose         whole-body rotation / scale, pivot at the feet
 *   prefix-squash       squash & stretch, pivot at the feet
 *   prefix-legL/R       legs incl. shoes, pivot at the hip
 *   prefix-body         torso
 *   prefix-armL/R       arms, pivot at the shoulder
 *   prefix-handL/R      hand (hidden while "in pocket")
 *   prefix-head         head, pivot at the neck
 *   prefix-face         features; slide on x to turn the head
 *   prefix-mouth-*      mouth shapes, toggle with opacity
 *   prefix-brows        eyebrows (locs) - move on y for expressions
 *   cap only: prefix-gun (finger-gun hand on the right arm),
 *             prefix-back (back view), prefix-front (front view)
 */
(function (global) {
  const INK = "#26262b";
  const PAPER = "#f6f2ea";
  const TONE = "#dcd6cb";
  const SKIN = "#efe6d8";
  const W = 'stroke="' + INK + '" stroke-linejoin="round" stroke-linecap="round"';

  function rng(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  // Twisted locs: short twists radiating out over the top of the head.
  function locsTop(seed) {
    const r = rng(seed);
    let out = `<path d="M-64,-92 Q-70,-150 0,-158 Q70,-150 64,-92 Q0,-120 -64,-92 Z" fill="#3d3d42"/>`;
    const rows = [[13, 66, 0.92], [10, 46, 1.0], [6, 24, 1.05]];
    rows.forEach(([n, rad, sz], row) => {
      for (let i = 0; i < n; i++) {
        const a = Math.PI * (1.02 + (0.96 * (i + 0.5)) / n) + (r() - 0.5) * 0.12;
        const x = Math.cos(a) * rad * 1.05;
        const y = -100 + Math.sin(a) * rad * 0.95 - row * 8;
        const deg = (a * 180) / Math.PI + 90 + (r() - 0.5) * 16;
        const k = sz * (0.9 + r() * 0.3);
        out += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${deg.toFixed(1)}) scale(${k.toFixed(2)})">
          <path d="M-10,4 Q-12,-18 -2,-32 Q4,-36 8,-30 Q13,-16 10,4 Q0,10 -10,4 Z" fill="#5a5a61" ${W} stroke-width="3.5"/>
          <path d="M-7,-4 l12,-5 M-7,-14 l12,-5 M-4,-23 l9,-4" stroke="#b3b3b8" stroke-width="2.5" stroke-linecap="round"/>
        </g>`;
      }
    });
    return out;
  }

  // Locs hanging from under a cap, drawn behind the face.
  function hangingLocs(side, len, seed) {
    const r = rng(seed);
    let out = "";
    for (let i = 0; i < 5; i++) {
      const x = side * (44 + i * 9);
      const l = len - i * 6 + r() * 12;
      out += `<path d="M${x},-110 q${side * 8},${l * 0.3} 0,${l * 0.55} q${-side * 8},${l * 0.25} ${side * 4},${l * 0.45}"
        fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>
        <path d="M${x},-110 q${side * 8},${l * 0.3} 0,${l * 0.55} q${-side * 8},${l * 0.25} ${side * 4},${l * 0.45}"
        fill="none" stroke="#55555c" stroke-width="7" stroke-linecap="round" stroke-dasharray="6 5"/>`;
    }
    return out;
  }

  // Baggy wide-leg trousers + chunky sneaker. Drawn from the hip pivot down.
  function leg(side, opts = {}) {
    const s = side;
    return `
      <path d="M-46,0 L46,0 C56,100 70,190 80,262 Q40,280 0,274 Q-40,280 -82,262 C-70,190 -56,100 -46,0 Z"
            fill="${PAPER}" ${W} stroke-width="5"/>
      <path d="M-30,46 l22,26 l-20,22 M14,118 l26,24 l-28,20 M-54,196 l32,14 l-12,22 M26,206 l24,24 M-10,250 l16,-14 l16,14"
            fill="none" stroke="#6b6b72" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${opts.cargo ? `<path d="M${s * 34},120 l${s * 46},6 l${s * 2},70 l${-s * 44},-4 Z" fill="${PAPER}" ${W} stroke-width="4"/>
                      <path d="M${s * 34},134 l${s * 46},6" stroke="${INK}" stroke-width="3"/>` : ""}
      <g transform="translate(${6 * s},286)">
        <path d="M-70,-4 Q-70,-36 -40,-40 L40,-40 Q70,-36 72,-4 L74,16 Q74,26 64,26 L-62,26 Q-72,26 -72,16 Z"
              fill="${PAPER}" ${W} stroke-width="5"/>
        <path d="M-72,6 L74,6" stroke="${INK}" stroke-width="4"/>
        <path d="M-60,16 l10,-6 l10,6 l10,-6 l10,6 l10,-6 l10,6 l10,-6 l10,6 l10,-6 l10,6 l10,-6 l10,6"
              fill="none" stroke="#7a7a82" stroke-width="3"/>
        <path d="M-22,-36 l44,0 M-18,-28 l36,0 M-30,-20 q30,-8 60,0" fill="none" stroke="#6b6b72" stroke-width="3.5" stroke-linecap="round"/>
        <rect x="-60" y="-26" width="34" height="22" rx="6" fill="${TONE}" stroke="${INK}" stroke-width="3"/>
        ${opts.zero ? `<text x="${s > 0 ? 36 : -50}" y="0" font-family="Permanent Marker, cursive" font-size="22" fill="${INK}">0</text>` : ""}
      </g>`;
  }

  function hand(id, opts = {}) {
    return `<g id="${id}" ${opts.hidden ? 'opacity="0"' : ""}>
      <path d="M-22,-8 Q-26,24 -6,32 Q18,34 24,10 Q26,-8 14,-12 L-12,-12 Q-22,-12 -22,-8 Z" fill="${SKIN}" ${W} stroke-width="4.5"/>
      <path d="M-10,6 l0,18 M2,8 l0,20 M14,6 l0,16" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    </g>`;
  }

  // Finger gun pointing down the arm (+y): index out, thumb cocked.
  function fingerGun(id) {
    return `<g id="${id}" opacity="0">
      <path d="M-20,-10 Q-26,20 -4,26 L4,26 L6,74 Q8,84 16,82 Q22,80 22,72 L22,22 Q26,4 16,-10 Z" fill="${SKIN}" ${W} stroke-width="4.5"/>
      <path d="M-20,-4 Q-40,-6 -42,10 Q-40,18 -24,14" fill="${SKIN}" ${W} stroke-width="4.5"/>
      <path d="M-8,10 q10,4 20,0 M-8,18 q10,4 20,0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    </g>`;
  }

  function arm(id, sd, x, y, opts) {
    const s = sd === "L" ? -1 : 1;
    const sleeve = opts.hoodie
      ? `<path d="M-30,-10 Q0,-30 30,-10 Q42,90 38,176 L-38,176 Q-40,90 -30,-10 Z" fill="${PAPER}" ${W} stroke-width="5"/>
         <path d="M-38,160 L38,160 M-26,162 l0,14 M-12,162 l0,14 M2,162 l0,14 M16,162 l0,14 M28,162 l0,14" stroke="${INK}" stroke-width="3"/>
         <path d="M${-s * 18},40 q${s * 20},30 ${s * 4},70" fill="none" stroke="#6b6b72" stroke-width="3.5" stroke-linecap="round"/>`
      : `<path d="M-28,-8 Q0,-26 28,-8 L36,172 L-36,172 Z" fill="${PAPER}" ${W} stroke-width="5"/>
         <rect x="-36" y="164" width="72" height="22" rx="4" fill="${PAPER}" ${W} stroke-width="4"/>
         <circle cx="${s * 22}" cy="175" r="3.5" fill="${INK}"/>
         <path d="M${-s * 14},50 l${s * 18},20 l${-s * 16},16" fill="none" stroke="#6b6b72" stroke-width="3.5" stroke-linecap="round"/>`;
    return `<g transform="translate(${x * s},${y})"><g id="${id}-arm${sd}">
      ${sleeve}
      <g transform="translate(0,${opts.hoodie ? 196 : 206})">
        ${hand(id + "-hand" + sd, { hidden: opts.pockets })}
        ${opts.gun && sd === "R" ? fingerGun(id + "-gun") : ""}
      </g>
    </g></g>`;
  }

  function locs(id, scale = 1) {
    return `
<g id="${id}"><g id="${id}-pose">
 <g transform="scale(${scale})">
  <g id="${id}-squash">
   <ellipse cx="0" cy="6" rx="150" ry="14" fill="${INK}" opacity=".16"/>
   <g transform="translate(-50,-300)"><g id="${id}-legL">${leg(-1)}</g></g>
   <g transform="translate(50,-300)"><g id="${id}-legR">${leg(1)}</g></g>
   <g id="${id}-body">
     <rect x="-18" y="-516" width="36" height="30" fill="${SKIN}" ${W} stroke-width="4.5"/>
     <path d="M-112,-470 Q-102,-494 -52,-498 L52,-498 Q102,-494 112,-470 L126,-262 Q100,-246 0,-250 Q-100,-246 -126,-262 Z"
           fill="${PAPER}" ${W} stroke-width="5"/>
     <path d="M-26,-498 Q0,-478 26,-498" fill="${TONE}" ${W} stroke-width="4"/>
     <path d="M-40,-502 L-10,-470 L-28,-446 L-52,-492 Z M40,-502 L10,-470 L28,-446 L52,-492 Z" fill="${PAPER}" ${W} stroke-width="4.5"/>
     <path d="M2,-470 L4,-252" stroke="${INK}" stroke-width="4"/>
     ${[-440, -400, -360, -320, -280].map((y) => `<circle cx="14" cy="${y}" r="4" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>`).join("")}
     <text x="-92" y="-412" font-family="Permanent Marker, cursive" font-size="30" fill="${INK}">CiSK</text>
     <path d="M-62,-404 L-62,-352 M-76,-388 L-48,-388" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
     <path d="M-96,-330 l26,20 l-22,18 M70,-440 l20,30 M84,-330 l-20,26 l18,16" fill="none" stroke="#6b6b72" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M-20,-252 q-6,26 4,40 M20,-252 q6,22 -2,36" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
   </g>
   ${arm(id, "L", 110, -462, { pockets: true })}
   ${arm(id, "R", 110, -462, { pockets: true })}
   <g transform="translate(0,-500)"><g id="${id}-head"><g transform="scale(1.28)">
     <path d="M-60,-96 Q-66,-20 -42,18 Q-20,48 0,50 Q20,48 42,18 Q66,-20 60,-96 Q0,-136 -60,-96 Z" fill="${SKIN}" ${W} stroke-width="5"/>
     <path d="M-62,-62 q-20,-4 -18,18 q4,18 22,14 M62,-62 q20,-4 18,18 q-4,18 -22,14" fill="${SKIN}" ${W} stroke-width="4.5"/>
     <path d="M-60,-108 L-58,-70 M-54,-110 L-52,-72 M-48,-112 L-46,-78 M60,-108 L58,-70 M54,-110 L52,-72 M48,-112 L46,-78"
           stroke="#6b6b72" stroke-width="3" stroke-linecap="round"/>
     ${locsTop(11)}
     <g id="${id}-face">
       <g id="${id}-brows">
         <path d="M-50,-66 L-12,-50" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
         <path d="M50,-66 L12,-50" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
       </g>
       <g id="${id}-eyes">
         <path d="M-44,-36 Q-28,-30 -12,-36 Q-14,-20 -28,-18 Q-42,-20 -44,-36 Z" fill="#fff" ${W} stroke-width="3.5"/>
         <path d="M44,-36 Q28,-30 12,-36 Q14,-20 28,-18 Q42,-20 44,-36 Z" fill="#fff" ${W} stroke-width="3.5"/>
         <circle id="${id}-pupilL" cx="-24" cy="-28" r="7" fill="${INK}"/>
         <circle id="${id}-pupilR" cx="22" cy="-28" r="7" fill="${INK}"/>
         <path d="M-46,-38 L-10,-38 M46,-38 L10,-38" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
       </g>
       <path d="M-2,-8 q6,8 -2,12" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
       <path d="M-44,0 l8,8 M-36,-2 l8,8 M44,0 l-8,8 M36,-2 l-8,8" stroke="#9a9aa0" stroke-width="2.5" stroke-linecap="round"/>
       <path id="${id}-mouth-frown" d="M-12,24 Q0,18 12,24" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
       <path id="${id}-mouth-smirk" d="M-12,22 Q4,28 16,16" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" opacity="0"/>
       <ellipse id="${id}-mouth-o" cx="0" cy="24" rx="8" ry="10" fill="${INK}" opacity="0"/>
       <path id="${id}-vein" d="M30,-108 l10,10 m-4,-14 l0,14 m10,-10 l-14,0" stroke="#e0412b" stroke-width="5" stroke-linecap="round" opacity="0"/>
     </g>
   </g></g></g>
  </g>
 </g>
</g></g>`;
  }

  function cap(id, scale = 1) {
    return `
<g id="${id}"><g id="${id}-pose">
 <g transform="scale(${scale})">
  <g id="${id}-squash">
   <ellipse cx="0" cy="6" rx="150" ry="14" fill="${INK}" opacity=".16"/>
   <g transform="translate(-52,-300)"><g id="${id}-legL">${leg(-1)}</g></g>
   <g transform="translate(52,-300)"><g id="${id}-legR">${leg(1, { cargo: true, zero: true })}</g></g>
   <g id="${id}-body">
     <path d="M-120,-470 Q-110,-500 -50,-506 L50,-506 Q110,-500 120,-470 L134,-270 Q136,-238 110,-234 L-110,-234 Q-136,-238 -134,-270 Z"
           fill="${PAPER}" ${W} stroke-width="5"/>
     <path d="M-130,-266 L130,-266" stroke="${INK}" stroke-width="4"/>
     ${Array.from({ length: 16 }, (_, i) => `<path d="M${-116 + i * 15.5},-262 l0,24" stroke="#6b6b72" stroke-width="2.5"/>`).join("")}
     <g id="${id}-front">
       <path d="M-62,-512 Q0,-470 62,-512 Q74,-530 50,-536 Q0,-500 -50,-536 Q-74,-530 -62,-512 Z" fill="${TONE}" ${W} stroke-width="4.5"/>
       <path d="M-22,-494 q-4,60 -14,90 m-2,0 a8,8 0 1 0 1,0 M22,-494 q6,50 12,80 m0,0 a8,8 0 1 0 1,0" fill="none" ${W} stroke-width="3.5"/>
       <path d="M-80,-360 Q-84,-290 -70,-280 L70,-280 Q84,-290 80,-360 Q0,-340 -80,-360 Z" fill="${PAPER}" ${W} stroke-width="4"/>
       <text x="18" y="-420" font-family="Permanent Marker, cursive" font-size="24" fill="${INK}">CiSK</text>
       <path d="M46,-414 L46,-376 M36,-402 L56,-402" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
       <path d="M-100,-430 l22,24 M90,-320 l-18,22" fill="none" stroke="#6b6b72" stroke-width="3.5" stroke-linecap="round"/>
     </g>
     <g id="${id}-back" opacity="0">
       <path d="M-100,-496 Q-112,-370 -40,-356 L40,-356 Q112,-370 100,-496 Q0,-540 -100,-496 Z" fill="${PAPER}" ${W} stroke-width="5"/>
       <path d="M-70,-470 Q0,-500 70,-470" fill="none" stroke="#6b6b72" stroke-width="3.5"/>
       <text x="-52" y="-404" font-family="Permanent Marker, cursive" font-size="40" fill="${INK}">CiSK</text>
       <path d="M10,-398 L10,-350 M-6,-382 L26,-382" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
       <path d="M-60,-330 l40,40 l-30,20 M50,-320 l20,40" fill="none" stroke="#6b6b72" stroke-width="3.5" stroke-linecap="round"/>
     </g>
     <path d="M-30,-232 q-10,30 -24,30 a10,10 0 1 0 6,-12" fill="none" ${W} stroke-width="3.5"/>
   </g>
   ${arm(id, "L", 116, -462, { hoodie: true })}
   ${arm(id, "R", 116, -462, { hoodie: true, gun: true })}
   <g transform="translate(0,-506)"><g id="${id}-head"><g transform="scale(1.28)">
     ${hangingLocs(-1, 120, 3)}
     ${hangingLocs(1, 120, 9)}
     <g id="${id}-headFront">
       <path d="M-56,-96 Q-62,-20 -40,18 Q-20,46 0,48 Q20,46 40,18 Q62,-20 56,-96 Z" fill="${SKIN}" ${W} stroke-width="5"/>
       <g id="${id}-face">
         <path d="M-54,-96 L54,-96 L52,-52 Q0,-40 -52,-52 Z" fill="#6f6f76" opacity=".55"/>
         ${Array.from({ length: 12 }, (_, i) => `<path d="M${-50 + i * 9},-94 l-10,38" stroke="${INK}" stroke-width="2" opacity=".55"/>`).join("")}
         <path id="${id}-glint" d="M-30,-64 l14,0 M14,-64 l14,0" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
         <path d="M2,-28 q6,8 -2,12" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
         <path id="${id}-mouth-smirk" d="M-14,12 Q6,22 20,6" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
         <g id="${id}-mouth-grin" opacity="0">
           <path d="M-22,6 Q2,40 26,4 Q2,14 -22,6 Z" fill="${INK}"/>
           <path d="M-16,8 Q2,14 20,7 L18,13 Q2,18 -14,13 Z" fill="#fff"/>
         </g>
         <ellipse id="${id}-mouth-o" cx="2" cy="16" rx="8" ry="10" fill="${INK}" opacity="0"/>
       </g>
       <g id="${id}-capFront">
         <path d="M-66,-96 Q-66,-172 0,-176 Q66,-172 66,-96 Z" fill="${PAPER}" ${W} stroke-width="5"/>
         <path d="M0,-176 L0,-100 M-40,-160 Q-50,-130 -50,-100 M40,-160 Q50,-130 50,-100" fill="none" stroke="#6b6b72" stroke-width="3"/>
         <circle cx="0" cy="-176" r="6" fill="${PAPER}" stroke="${INK}" stroke-width="3.5"/>
         <path d="M-84,-98 Q0,-118 84,-98 Q100,-82 84,-70 Q0,-92 -84,-70 Q-100,-82 -84,-98 Z" fill="${PAPER}" ${W} stroke-width="5"/>
         <path d="M-70,-86 Q0,-102 70,-86" fill="none" stroke="#6b6b72" stroke-width="3" stroke-dasharray="6 6"/>
       </g>
     </g>
     <g id="${id}-headBack" opacity="0">
       ${hangingLocs(-1, 105, 5).replace(/M(-?\d+),-110/g, (m, x) => "M" + (x * 0.4).toFixed(0) + ",-110")}
       <path d="M-60,-100 Q-60,-174 0,-178 Q60,-174 60,-100 Z" fill="${PAPER}" ${W} stroke-width="5"/>
       <path d="M-22,-104 Q0,-136 22,-104 Z" fill="#4a4a50" ${W} stroke-width="4"/>
       <path d="M-34,-104 L34,-104" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
       <path d="M58,-104 Q120,-110 150,-80 Q130,-66 64,-84 Z" fill="${PAPER}" ${W} stroke-width="5"/>
     </g>
   </g></g></g>
  </g>
 </g>
</g></g>`;
  }

  // Shared <defs>: pencil wobble filter + hatch patterns.
  const defs = `
  <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence id="pencilNoise" type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
    <line x1="0" y1="0" x2="0" y2="9" stroke="${INK}" stroke-width="1.6" opacity=".5"/>
  </pattern>`;

  global.PauseCharacters = { locs, cap, defs, INK, PAPER };
})(window);
