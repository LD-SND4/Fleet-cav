# Honeycomb login page component — spec

This document is a precise implementation spec for a login page component with a
diagonal, tessellating hexagon ("honeycomb") section that reacts to mouse hover
with a blue-to-green ripple. Hand this file to an LLM/agent along with your
codebase and ask it to match this behavior exactly — every numeric value below
is intentional, not a placeholder.

## 1. Layout structure

Three-part split layout:

1. **Left section, top** — description/presentation content (heading + paragraph).
2. **Left section, bottom** — the honeycomb hex-grid section. Fills the remaining
   vertical space of the left column.
3. **Right section** — login/register form, fixed width, sits beside the left
   column (not below it) on desktop.

```
┌─────────────────────────────┬──────────────┐
│  Welcome back                │              │
│  <description text>          │  Sign in     │
│                               │  form        │
│  ░░░░░░ honeycomb ░░░░░░      │  fields      │
│  ░░░░░░ (diagonal)  ░░░░░     │  buttons     │
└─────────────────────────────┴──────────────┘
```

- `.container`: `display: flex`, fixed/min height, `overflow: hidden`, rounded
  corners on the outer wrapper.
- `.left-section`: `flex: 1` (grows to fill), `display: flex; flex-direction: column`.
- `.content-top`: fixed-height content block, sits above the hex section,
  `z-index: 2` so it always renders above/unaffected by the hex layer.
- `.hexagon-section`: `flex: 1` (fills remaining vertical space),
  `position: relative; overflow: hidden`. **This `overflow: hidden` is required**
  — it's what clips the oversized, rotated hex grid into a clean rectangle with
  no ragged/partial hexagons visible at the edges.
- `.right-section`: fixed width (`flex: 0 0 380px`), separated by a hairline
  left border.

On narrow viewports (`max-width: 700px`), the container switches to
`flex-direction: column` and the right section gets a top border instead of a
left border.

## 2. Hexagon geometry (exact math — do not approximate)

The hexagons are **flat-top**, tessellating with zero gaps. This only works if
the geometry below is followed exactly — approximated hex grids (e.g. plain
CSS pattern backgrounds, or generic "honeycomb" snippets) tend to leave visible
seams.

- Hex "radius" (center to vertex): `s = 15`
- Column spacing (horizontal distance between adjacent hex centers in the same
  row): `colSpacing = s * 1.5 = 22.5`
- Row spacing (vertical distance between rows): `rowSpacing = s * sqrt(3) ≈ 25.98`
- Row offset (vertical offset applied to alternating columns so hexes
  interlock): `rowOffset = rowSpacing / 2 ≈ 12.99`

Vertex generation for a flat-top hex centered at `(cx, cy)`:

```js
function hexPoints(cx, cy) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 180 * (60 * i); // 0°, 60°, 120°, 180°, 240°, 300°
    pts.push(
      (cx + s * Math.cos(angle)).toFixed(2) + "," +
      (cy + s * Math.sin(angle)).toFixed(2)
    );
  }
  return pts.join(" ");
}
```

### Grid generation

Two equally valid implementations exist depending on whether you need the
grid to be interactive (see Section 4):

**A. Static SVG `<pattern>` fill** (cheapest, use if no hover interaction is
needed):

```html
<pattern id="hexPatternBase" x="0" y="0" width="45" height="25.98" patternUnits="userSpaceOnUse">
  <polygon points="30,12.99 22.5,25.98 7.5,25.98 0,12.99 7.5,0 22.5,0" fill="none" stroke="#378ADD" stroke-width="1.5" opacity="0.45"/>
  <polygon points="52.5,0 45,12.99 30,12.99 22.5,0 30,-12.99 45,-12.99" fill="none" stroke="#378ADD" stroke-width="1.5" opacity="0.45"/>
  <polygon points="52.5,25.98 45,38.97 30,38.97 22.5,25.98 30,12.99 45,12.99" fill="none" stroke="#378ADD" stroke-width="1.5" opacity="0.45"/>
</pattern>
<rect width="400" height="300" fill="url(#hexPatternBase)"/>
```

This tile is `45 × 25.98` (`= colSpacing * 2` by `rowSpacing`) and contains the
minimum repeating unit (one full hex + two half-hexes that complete the
adjacent column at the tile boundary). This exact tile is what was
visually approved as the final look — reproduce it exactly if the goal is
visual parity with an existing approved design.

**B. Individually generated `<polygon>` cells** (required for hover behavior):

```js
const svgNS = "http://www.w3.org/2000/svg";
const s = 15;
const colSpacing = s * 1.5;
const rowSpacing = s * Math.sqrt(3);
const rowOffset = rowSpacing / 2;

const cells = [];
let col = 0;
for (let cx = -50; cx <= 450; cx += colSpacing) {
  const yOff = (col % 2 === 0) ? 12.99 : 0;
  for (let cy = -50 + yOff; cy <= 350; cy += rowSpacing) {
    const poly = document.createElementNS(svgNS, "polygon");
    poly.setAttribute("points", hexPoints(cx, cy));
    poly.setAttribute("class", "hexcell");
    overlayGroup.appendChild(poly);
    cells.push({ el: poly, cx, cy });
  }
  col++;
}
```

The generation bounds (`-50` to `450` for x, `-50` to `350` for y, against a
`viewBox="0 0 400 300"`) intentionally overflow the visible viewBox on all
sides. This is required so that when the whole grid is rotated via CSS
transform, there's no exposed corner with missing hexagons. Do not tighten
these bounds without re-checking coverage at the rotation angle in Section 3.

## 3. Placement transform (the "signature" diagonal)

The hex grid sits in a wrapper div positioned and transformed like this:

```css
.hexagon-section {
  flex: 1;
  position: relative;
  overflow: hidden; /* clips the oversized/rotated grid */
  min-height: 260px;
}

.hexagons {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  transform:
    translate(-50%, -50%)     /* re-center the anchor point */
    translate(-7%, 19%)       /* X/Y nudge */
    rotate(-56deg);           /* diagonal angle */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Approved final values — use exactly these:**

| Property | Value |
|---|---|
| Angle | `-56deg` |
| Size | `150%` (of `.hexagon-section` width/height) |
| X position | `-7%` |
| Y position | `19%` |

**Why the double-translate matters:** `translate(-50%, -50%)` must be applied
*before* the X/Y nudge and the rotation, because it re-centers the element's
own coordinate origin. If you instead position via `top/left` percentages
directly (without the `-50%, -50%` recenter), rotation pivots around a corner
instead of the shape's center, and you'll see the exact bug this project hit
earlier: hexagons getting visibly cut off / a ragged edge at the container
boundary, because the oversized element is no longer guaranteed to overhang
every edge symmetrically.

If your current implementation is "behaving differently," check these in order:
1. Is `.hexagon-section` (the immediate parent) `overflow: hidden`? Without
   it, the oversized grid will spill outside the intended box.
2. Is the transform order exactly
   `translate(-50%,-50%) translate(Xpercent, Ypercent) rotate(deg)`? Reordering
   these (e.g. rotating before recentering) produces different visual results.
3. Is `width`/`height` on `.hexagons` set to `150%` of its own containing
   block, not `150%` of the viewport or some other ancestor?
4. Is the SVG's `viewBox` still `0 0 400 300` with `preserveAspectRatio="xMidYMid slice"`?
   Changing the viewBox aspect ratio changes hex density/stretch.

## 4. Hover behavior — blue-to-green ripple

**Behavior:** as the cursor moves over the hex section, hexagons near the
cursor shift their stroke color from blue (`#378ADD`) to green (`#639922`),
with intensity fading smoothly by distance — a "ripple" of color centered on
the cursor, not a single-cell hover highlight.

**Why per-hexagon CSS `:hover` does not work:** if the honeycomb is rendered
as a single `<pattern>` fill (Section 2A), there is only one DOM element (the
`<rect>`) — hovering it can't target individual hexagons, because they aren't
separate elements. Individually generated `<polygon>` cells (Section 2B) are
required for any interactivity.

**Implementation — two-layer approach** (used to preserve an already-approved
static look while adding interactivity):

1. Keep the approved static `<pattern>` fill as the base visual layer
   (Section 2A) — always visible, unaffected by hover.
2. Add a second `<g>` overlay containing individually generated polygon cells
   (Section 2B), each starting at `opacity: 0`, positioned with **identical
   geometry** to the base pattern (same `s`, `colSpacing`, `rowSpacing`,
   `rowOffset` — this is what makes the overlay hexagons land exactly on top
   of the base pattern's hexagons instead of appearing offset/misaligned).
3. On `mousemove` over the section, convert the client (screen) coordinates
   into the SVG's local coordinate space using `getScreenCTM().inverse()` —
   necessary because the grid is rotated/scaled/translated via CSS transform,
   so raw mouse coordinates don't correspond to raw SVG coordinates.
4. For every cell, compute Euclidean distance from the converted cursor point
   to that cell's center `(cx, cy)`. If within `RIPPLE_RADIUS`, set the cell's
   `stroke` to green and its `opacity` proportional to `1 - (distance / RIPPLE_RADIUS)`
   (linear falloff — closer hexagons are more opaque/vivid). Otherwise, set
   opacity back to `0`.
5. On `mouseleave`, reset every cell's opacity to `0`.

```css
.hexcell {
  fill: none;
  stroke: #378ADD;
  stroke-width: 1.5;
  opacity: 0;
  transition: stroke 0.3s ease, opacity 0.3s ease;
}
```

```js
const RIPPLE_RADIUS = 60;

function handleMove(evt) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return;
  const local = pt.matrixTransform(ctm.inverse());

  cells.forEach(function (cell) {
    const dx = cell.cx - local.x;
    const dy = cell.cy - local.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < RIPPLE_RADIUS) {
      const t = 1 - dist / RIPPLE_RADIUS;
      cell.el.style.stroke = "#639922";
      cell.el.style.opacity = (t * 0.9).toFixed(2);
    } else {
      cell.el.style.opacity = "0";
    }
  });
}

function handleLeave() {
  cells.forEach(function (cell) {
    cell.el.style.opacity = "0";
  });
}

hexSection.addEventListener("mousemove", handleMove);
hexSection.addEventListener("mouseleave", handleLeave);
```

**Common causes of "the ripple doesn't work" bugs:**
- Using plain CSS `:hover` on pattern-filled elements (see explanation above)
  — this can only ever affect the single `<rect>`, not individual hexagons.
- Forgetting `getScreenCTM().inverse()` and instead using
  `evt.offsetX`/`evt.offsetY` directly — these will be wrong as soon as the
  grid has any CSS `transform` applied (rotation/translation/scale), which it
  always does here (Section 3).
- Attaching the mousemove listener to the `<svg>` element instead of the
  outer `.hexagon-section` div — if the SVG's `overflow` isn't `visible` or if
  child elements block pointer events unexpectedly, events can fail to fire
  at the edges.
- Mismatched geometry constants between the base pattern layer and the
  overlay layer (e.g. different `s`, or forgetting the alternating
  `rowOffset` on odd columns) — causes overlay hexagons to not align with the
  visible pattern hexagons, so the "hover" area looks offset from what's
  visually under the cursor.

## 5. Color reference

| Token | Hex | Usage |
|---|---|---|
| Hex stroke (default) | `#378ADD` | Blue — resting state |
| Hex stroke (hover/ripple) | `#639922` | Green — active/ripple state |
| Base pattern opacity | `0.45` | Resting hexagon visibility |
| Ripple max opacity | `0.9` (`t * 0.9` at t=1, i.e. cursor directly over center) | Peak ripple intensity |

## 6. Full reference implementation

The complete, working HTML/CSS/JS for this component (as last verified) is in
the accompanying file `honeycomb-login-component.html` in this same delivery —
use it as ground truth if any part of this written spec is ambiguous.
