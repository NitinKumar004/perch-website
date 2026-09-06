# Perch — marketing site

The website for [Perch](https://github.com/NitinKumar004/perch), the Mac notch
status HUD for developers. Static, dependency-free, and deployable anywhere.

## Run it

Just open `index.html` — double-click it, or serve the folder:

```bash
python3 -m http.server 8000    # then visit http://localhost:8000
```

No build step, no npm, no framework. Everything is plain HTML/CSS/JS.

## Structure

```
index.html                 # the page — markup + section order
assets/
  css/
    tokens.css             # colour, type, spacing, motion — the design system
    base.css               # reset, ground, grain/vignette, typography, helpers
    animations.css         # keyframes + the reveal system (+ reduced-motion)
    components.css         # nav, buttons, the notch HUD, cards, terminal, playground
    sections.css           # hero, problem, pinned demo, grid, principles, install, footer
  js/
    util.js                # shared helpers + the Perch namespace
    nav.js                 # menu-bar mobile toggle
    clock.js               # live clock in the menu bar
    spotlight.js           # cursor-following ember spotlight
    scramble.js            # decode/scramble effect on the mono eyebrows
    reveal.js              # IntersectionObserver reveals + count-up stats
    section-index.js       # rail highlight + menu-bar notch narration
    sheen.js               # pointer-tracking card sheen
    magnetic.js            # magnetic buttons
    modules-data.js        # module catalogue → renders the grid (source of truth)
    notch-demo.js          # the pinned, scroll-driven HUD sequence
    playground.js          # interactive "build your own notch"
    terminal.js            # typed install command + copy
    main.js                # hero reveal + ticker + problem-section flicker
  img/
    favicon.svg
```

## Design concept

**The whole page is a living macOS surface running Perch.** A real menu bar is
pinned at the top with the notch dead-centre as a persistent character that
*narrates the page* — its pills change per section as you scroll.

- Palette: "Graphite & Ember" — a warm near-black with an ember-orange lead
  (deliberately not the blue/purple/cyan AI default). Semantic status colours
  (green/amber/red/blue) match the app.
- Type: Bricolage Grotesque (display) + Instrument Sans (body) + JetBrains Mono.
- Signature motion: cursor spotlight, decode/scramble eyebrows, a mono ticker,
  a left section-index minimap, the pinned notch-demo sequence, magnetic buttons.
- Spring easing everywhere, transform/opacity only in hot paths for 60fps.
- `prefers-reduced-motion` is honoured throughout: spotlight, scramble, ticker,
  pinning, typing, and magnetic effects collapse to a clean static state.

## Deploy

Any static host. For GitHub Pages, push to a repo and point Pages at the root
(or copy these files into the app repo's `/docs`).
