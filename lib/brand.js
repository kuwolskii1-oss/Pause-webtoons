/*
 * Pause brand: palette and the hand-drawn pause mark (two marker bars on a
 * baseline with an ink drip). Redrawn as SVG from the brand sheet. Swap in
 * the original vector here if it becomes available.
 *
 *   PauseBrand.mark({ color, id })  -> <g> markup centred on (0,0), about
 *                                      230 x 250 units; parts get ids
 *                                      `${id}-bar1`, `-bar2`, `-base`,
 *                                      `-drip`, `-dot` for draw-on animation.
 */
(function (global) {
  const palette = {
    umber: "#6b4226",       // "umber on sketchbook"
    sketchbook: "#efe8dc",
    graphite: "#201f1d",    // "paper on graphite" / "graphite"
    paper: "#ede6d6",
  };

  function mark({ color = palette.umber, id = "mark" } = {}) {
    const s = `fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"`;
    // Coordinates traced from the brand sheet, then centred on (0,0).
    return `<g transform="translate(-268,-250)">
      <g id="${id}-bar1" ${s}>
        <path d="M229,146 C227,200 223,255 218,300" stroke-width="34"/>
        <path d="M234,142 C237,200 235,255 229,296" stroke-width="22"/>
      </g>
      <g id="${id}-bar2" ${s}>
        <path d="M309,140 C311,200 312,255 311,298" stroke-width="34"/>
        <path d="M301,145 C301,200 304,255 307,300" stroke-width="26"/>
      </g>
      <path id="${id}-base" d="M163,331 Q270,327 374,322" ${s} stroke-width="13"/>
      <path id="${id}-drip" d="M322,333 L324,355" ${s} stroke-width="7"/>
      <circle id="${id}-dot" cx="325" cy="367" r="9" fill="${color}"/>
    </g>`;
  }

  global.PauseBrand = { palette, mark };
})(window);
