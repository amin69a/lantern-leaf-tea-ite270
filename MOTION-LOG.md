# Motion log

**Student:** Mandana Shayeganfar  
**Shop name:** Lantern Leaf Tea  
**Live site:** https://amin69a.github.io/lantern-leaf-tea-ite270/

## Shop and personality

Lantern Leaf Tea is a fictional campus bubble tea shop for students taking a break between classes and friends meeting afterward. It serves jasmine milk tea, mango fruit tea, brown sugar boba, matcha cloud, berry hibiscus, and peach oolong.

My three words are **Calm, Bright, Responsive**. Calm means small 4.8-second sways, rather than fast decoration. Bright means a short, staggered headline entrance. Responsive means 90 ms control feedback and a clear two-part order confirmation. The storefront keeps the Week 3 lantern and hanging leaf sign, both pivoting from their hooks.

The project adapts the instructor's Bakery Motion Lab starter and its section structure, observer approach, status region, and Motion X-ray. I customized the content, layout, SVG artwork, motion timing, and interaction. I chose the pinned story (Option A) and removed the unused zoom option. The small adjustment from my plan is a custom deceleration curve for the badge, giving me a third purposeful easing curve without adding another distracting animation.

## Motion sentences

| # | Req | Trigger | Element | Property | Duration / delay | Easing | Job | Tool |
|---|-----|---------|---------|----------|------------------|--------|-----|------|
| 1 | R1 | Hover, keyboard focus, or focus inside a card; leaving reverses it | Buttons, menu cards, navigation links, secondary links | translateY 0 ↔ -2px | 90 ms, no delay | ease-out | Feedback: identify the control ready to interact | Base-rule CSS transition |
| 2 | R1 | Press and release | Same controls and cards | scale 1 ↔ .97 | 90 ms, no delay | ease-out | Feedback: acknowledge the press | Base-rule CSS transition + :active |
| 3 | R2 | Page load or Replay headline | Four hero words | translateY 12px → 0; opacity 0 → 1 | 650 ms each; delays 0/120/240/360 ms; last finishes at 1,010 ms | ease-out | Orientation: guide reading toward the main invitation | @keyframes + --i |
| 4 | R3 | Storefront loads | Hanging lantern | rotate -4° → 4° → -4° | 4.8 seconds per infinite loop; no delay | ease-in-out | Delight: make the shop feel gently alive | SVG + @keyframes |
| 5 | R3 | Storefront loads | Hanging leaf sign | rotate 3° → -3° → 3° | 4.8 seconds per infinite loop; -1.2 second phase offset | ease-in-out | Delight: give the second hanging object a calm, independent rhythm | SVG + @keyframes |
| 6 | R4 | At least 20% of a pending menu wrapper enters view | Menu reveal wrapper | translateY 10px → 0; opacity 0 → 1 | 300 ms; column delays 0/60/120 ms | ease-out | Orientation: introduce choices as the visitor reaches them | IntersectionObserver + CSS transition |
| 7 | R5 | The pearls step enters the center observer band; scrolling back reverses it | Pearl layer in the sticky drink | opacity 0 ↔ 1 | 350 ms, no delay | ease-in-out | Storytelling: show when the pearls join the tea | IntersectionObserver + CSS transition |
| 8 | R5 | The milk step enters the center observer band; scrolling back reverses it | Milk layer in the sticky drink | opacity 0 ↔ 1 | 350 ms, no delay | ease-in-out | Storytelling: connect the final ingredient to the written step | IntersectionObserver + CSS transition |
| 9 | R6 | Activate Add to order | Copy of the selected drink illustration | translate along a short raised path; scale 1 → .72 → .18; opacity 1 → 0 | 450 ms, no delay | ease-in-out | Continuity: connect the selected drink to the order bag | element.animate() |
| 10 | R6 | The flight's .finished promise resolves | Order count badge | scale 1 → 1.15 → 1 | 180 ms; starts after the 450 ms flight | cubic-bezier(.2,.8,.2,1) | Status: reinforce the updated count after arrival | element.animate(), chained with await animation.finished |
| 11 | R6 | An order is added or a motion-setting message is shown | Status toast | opacity 0 → 1; translateY 12px → 0 | 180 ms, no delay | ease-out | Status: make the aria-live confirmation visible too | CSS transition |
| 12 | R6 | Five seconds after the most recent status message | Status toast | opacity 1 → 0; translateY 0 → 12px | 180 ms, no delay | ease-out | Status: clear temporary feedback without obscuring the menu | CSS transition |

Complete sentences corresponding to the table:

1. When a visitor hovers over or keyboard-focuses a button, card, navigation link, or secondary link, that element changes its vertical position by 2 px over 90 ms with ease-out, so that the visitor can identify the control ready to interact; leaving or blurring reverses the same transition.
2. When the visitor presses or releases a control or card, it changes its scale between 1 and .97 over 90 ms with ease-out, so that the press receives immediate feedback.
3. When the page loads or the headline is replayed, each headline word changes its vertical offset from 12 px to 0 and its opacity from 0 to 1 over 650 ms, with a 120 ms stagger and ease-out, so that the visitor reads the invitation in order; the fourth word finishes at 1,010 ms.
4. When the storefront loads, the lantern changes its rotation from -4° to 4° and back over repeating 4.8-second cycles with ease-in-out, so that the storefront feels calmly alive.
5. When the storefront loads, the leaf sign changes its rotation from 3° to -3° and back over repeating 4.8-second cycles with ease-in-out and a -1.2-second phase offset, so that the second hanging piece adds gentle variety without competing with the menu.
6. When 20% of a waiting menu wrapper enters the viewport, it changes its opacity from 0 to 1 and its vertical offset from 10 px to 0 over 300 ms with ease-out and column delays of 0, 60, or 120 ms, so that visitors can follow newly arriving menu choices.
7. When the pearls step enters the center observer band, the sticky drink's pearl layer changes its opacity from 0 to 1 over 350 ms with ease-in-out, so that the picture explains the ingredient being described; returning to the tea step reverses it.
8. When the milk step enters the center observer band, the sticky drink's milk layer changes its opacity from 0 to 1 over 350 ms with ease-in-out, so that the visitor sees how the final ingredient completes the drink; scrolling back reverses it.
9. When a visitor activates Add to order, a copy of the selected drink changes its translate, scale, and opacity along a raised path toward the order bag over 450 ms with ease-in-out, so that the visitor sees where the drink went.
10. When that flight finishes, the order badge changes its scale from 1 to 1.15 and back over 180 ms with cubic-bezier(.2,.8,.2,1), so that the visitor notices the updated order count after the drink arrives.
11. When a drink is added or a motion-setting message is shown, the status toast changes its opacity from 0 to 1 and vertical offset from 12 px to 0 over 180 ms with ease-out, so that the confirmation is visible as well as announced through aria-live.
12. When five seconds have passed since the latest message, the toast changes its opacity from 1 to 0 and vertical offset from 0 to 12 px over 180 ms with ease-out, so that temporary feedback clears the view.

## Easing choices (R7)

1. **ease-out** gives the headline, reveals, toast, and control feedback a quick response followed by a gentle landing.
2. **ease-in-out** slows both ends of the hanging objects' direction changes, softens ingredient crossfades, and makes the drink's trip to the bag feel continuous.
3. **cubic-bezier(.2,.8,.2,1)** makes the short badge pulse respond strongly early and settle smoothly, so the order status is noticeable without a large or elastic bounce.

## What I saw in the X-ray

The local page was checked in Chrome with the instructor's Motion X-ray at **⅒×** speed. During an addition, the list showed a **JS animate()** row on **svg.flying-drink**, with a **450 ms** duration and **ease-in-out**. A subsequent observation showed the **180 ms** JS animation on **span#count.count**, with **cubic-bezier(0.2, 0.8, 0.2, 1)**, after the flight row had disappeared. At normal speed the two parts feel like one small confirmation; slowing down separates the travel from the badge pulse and makes the promise chain easier to inspect. The displayed durations remain their original values even when playback is slowed.

The headline rows separately showed delays of 0, 120, 240, and 360 ms, and both storefront loops showed 4,800 ms and infinite iterations. The leaf sign's negative delay puts it 1.2 seconds into its cycle rather than making it wait 1.2 seconds.

## Checks

- [x] **R8 — Reduced motion emulated in DevTools.** With `prefers-reduced-motion: reduce`, X-ray showed **0 animations** and **reduced motion: ON**. The headline and menu remain visible; loops, travel, pulses, and transitions stop. The complete story picture replaces the scrolling changes. The native media query and its JavaScript change listener both respond; an extra page switch also allows a visitor to request less motion but never overrides the device's reduced-motion request.
- [x] **R8 — Pause button.** Chrome's X-ray showed both infinite storefront loops as **paused** after Pause motion. Pressing Space on the focused button resumed them, and the label returned to Pause motion. Active order animations are tracked and paused too; new order clicks while paused update their count and message immediately.
- [x] **R8 — Focus partners.** Source review confirms every custom hover transform has a `:focus-visible` partner; cards also use `:focus-within` and have their own keyboard focus stop. A visible 3 px outline is retained. This source check is separate from the keyboard Pause test.
- [x] **R8 — No flashing.** No flashing keyframes or rapid visibility loops are used. Storefront loops take 4.8 seconds and rotate by only a few degrees.
- [x] **R9 — Paint flashing checked.** Enabled Chrome DevTools Rendering → Paint flashing and inspected the moving storefront with the X-ray closed. The steady loops did not visibly repaint a large page region. This was a manual local Chrome check, not a frame-rate benchmark. The helper's changing diagnostic bars are not production shop animations.
- [x] **R9 — Only transform and opacity animate.** Source review covers CSS keyframes, CSS transition property lists, and both WAAPI keyframe arrays. There is no `transition: all` in the shop stylesheet.
- [x] **R4 — JavaScript disabled.** Disabled JavaScript in Chrome DevTools and reloaded. The menu and explanatory no-JavaScript message remained visible; the order buttons were disabled rather than pretending to work. The reveal class has no hidden baseline; only JavaScript adds pending states. JavaScript was restored afterward.

## Implementation details and limits

- Both SVG groups use `transform-box: fill-box` and `transform-origin: 50% 0%`; each symmetric group starts at its fixed hook.
- Reveal wrappers and interactive cards are separate elements, so their transforms do not overwrite each other. Focusing a pending wrapper reveals it immediately.
- The story observer uses `rootMargin: '-45% 0px -45% 0px'`. Forward scroll was checked through tea, pearls, and milk; reverse scroll returned the picture to pearls.
- The order count and polite, atomic status message update once per click, even if a visitor asks for reduced motion during the flight. Canceled animations are handled and temporary SVG copies are removed.
- The bag opens a working demo summary with item quantities and a total; it does not accept payment or store personal data. Orders reset on reload.
- The desktop layout and the narrower layout while DevTools was docked were visually reviewed in Chrome. No claim is made here about every device or browser.
- The only console issue observed during the first local check was a missing favicon request. A local SVG favicon was then added. Publication and the required narrated recording are separate delivery steps.

## Credits

- Instructor starter and unchanged teaching helper: [ITE 270 Bakery Motion Lab](https://drjulsgilliam.github.io/ITE-270/module05/bakery-motion-lab.html#build).
- Storefront and drink SVGs are drawn in the project; no external image or font requests are required.
