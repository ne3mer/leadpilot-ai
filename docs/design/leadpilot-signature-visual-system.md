# LeadPilot Signature Visual System

**Phase:** 12C-4 — Signal  
**Foundation:** [leadpilot-design-system.md](./leadpilot-design-system.md), [leadpilot-premium-redesign.md](./leadpilot-premium-redesign.md)  
**Implementation:** `leadpilot-ai/app/globals.css`, `leadpilot-ai/components/visual/signal/*`

This phase defines LeadPilot’s **distinctive visual identity**. It does not replace the Quiet Instrument layout from 12C-1–3; it adds **character** (≈20%) on top of premium minimalism (≈80%).

---

## 1. Signal concept

LeadPilot helps users interpret **which leads matter**, **why**, **what changed**, and **what to do next**. The brand metaphor is **Signal**:

- **Nodes** — entities (leads, moments, decisions)
- **Lines / paths** — relationships and trajectories
- **Pulses** — change, attention, progression
- **Direction** — recommended motion (not literal charts)

Avoid literal network graphs, AI brains, robots, or glowing orbs. Think **abstract instrumentation**: precise, organic, technical, premium.

**Hierarchy:** Content → product function → brand expression. Never decoration over content.

---

## 2. Brand visual language

| Element | Role |
|--------|------|
| Curved path + traveling dot | Signal pulse along a trajectory |
| Paired nodes + dashed connector | Connection reveal |
| Vertical beam | Priority strength (with score text) |
| Layered lamellae (CSS 3D) | Signature brand artifact |
| Dashed quiet path + dim nodes | Empty / waiting state |
| Line + dot indicator | AI interpreting signal |

Palette stays **forest accent + graphite + ivory** — no second color system.

---

## 3. Signature object

**Component:** `SignatureSignalObject`  
**Technology:** CSS `perspective` + `transform-style: preserve-3d` (no WebGL, no Three.js)

Silhouette: stacked **lamellae** (soft organic ellipses) with a thin **beam** — reads as *signal → connection → direction*. Optional slow drift on desktop; static pose when reduced motion or `density="static"`.

**Allowed:** dashboard header (secondary), design lab, empty states, future marketing hero.  
**Not allowed:** every card, table row, or AI panel.

---

## 4. Color usage (signal tokens)

CSS variables on `:root`:

| Token | Purpose |
|-------|---------|
| `--lp-signal` | Active stroke / pulse (accent) |
| `--lp-signal-muted` | Quiet fills, idle nodes |
| `--lp-signal-active` | Emphasis (accent hover) |
| `--lp-signal-line` | Paths and connectors |
| `--lp-signal-glow` | Soft highlight on lamellae |
| `--lp-signal-graphite` / `--lp-signal-ivory` | Object shading |

Tailwind: `text-signal`, `bg-signal-line` where mapped in `@theme inline`.

---

## 5. Motion language

| Pattern | Class / component | Meaning |
|---------|-------------------|---------|
| Signal pulse | `SignalPath` + SMIL `animateMotion` | Energy along a path (once or lab toggle) |
| Connection reveal | `SignalNodes` + `lp-signal-connect` | Link established |
| Editorial entrance | `lp-motion-editorial-enter` | Greeting copy stagger |
| Priority emphasis | `PrioritySignalBeam` + `lp-priority-pulse` | Strength by level |
| AI generation | `AiSignalStatus` + `lp-ai-line` / `lp-ai-dot` | Interpretation in progress |

**Principles:**

- Motion has **purpose** and **direction**
- No random floating, bouncing cards, or parallax by default
- Fast UI feedback; slower ambient brand motion
- Infinite loops only where they represent **live signal** (priority/AI), and disabled under reduced motion

Constants: `lib/design-system/signal-motion.ts`.

---

## 6. AI visual language

AI = **interpretation of signal**. Same strokes and accent as deterministic UI:

- `AiSignalStatus` during generation (no purple, sparkles, brains, or orbs)
- `AiGeneratedLabel` disclosure unchanged (accent/neutral)

Do not create a separate “AI aesthetic.”

---

## 7. Priority signal treatment

**No scoring changes.** Visual only:

| Level | Strength | Beam behavior |
|-------|----------|----------------|
| High | `strong` | Brighter pulse, faster cycle |
| Medium | `moderate` | Moderate pulse |
| Low | `quiet` | Minimal static fill |

`LeadPrioritySignal` keeps **score + label text** as the source of truth; beam is `aria-hidden`.

Mapping: `lib/design-system/signal.ts` → `priorityToSignalStrength`.

---

## 8. 3D rules

| OK | Avoid |
|----|--------|
| One signature object, lazy-loaded | Spinning cubes, crypto orbs |
| Isolated brand moments | 3D behind body text |
| Static fallback markup | Heavy assets blocking LCP |
| `prefers-reduced-motion` static pose | Continuous rotation when reduced |

---

## 9. Responsive behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop | Full signature object + compact path in dashboard header |
| Tablet | Same, slightly scaled (`scale-90`) |
| Mobile | Header art **hidden**; greeting only — no extra scroll |

---

## 10. Accessibility

- Decorative visuals: `aria-hidden`, `role="presentation"`
- AI activity: `role="status"`, `aria-live="polite"`, visually hidden label
- Priority: never color/animation-only — text + score remain
- Reduced motion: global CSS disables decorative animations; connectors snap to connected state

Hook: `hooks/use-prefers-reduced-motion.ts` for client components.

---

## 11. Performance

- **No new 3D libraries**
- Dashboard art: `next/dynamic` + lightweight fallback DOM
- SVG + CSS animations (GPU-friendly transforms on object)
- No large image assets

---

## 12. Anti-patterns

- Generic green circle “decoration”
- Purple AI cards, sparkles, brains, robots
- Literal dashboard charts as wallpaper
- 3D beside every widget
- Infinite motion on buttons/cards
- Copying Linear / Apple / Stripe hero tropes

---

## 13. Examples (where implemented)

| Surface | What |
|---------|------|
| Dashboard header | `DashboardSignalArt` beside greeting |
| Pipeline empty | `SignalEmptyStructure` — “No leads yet” |
| Priority column/rows | `LeadPrioritySignal` + beam |
| Priority AI (loading) | `AiSignalStatus` in `LeadPriorityInsight` |
| Design lab | `/dashboard/design-lab` (auth only, not in nav) |

**Not in scope this phase:** full Lead Detail, Profile, Marketing, auth redesign.

---

## Design lab

URL: **`/dashboard/design-lab`** (signed-in only).  
Demonstrates paths, nodes, priority strengths, AI state, signature object densities, editorial motion, empty structure, and reduced-motion note.

Use the lab to approve the language before applying it in 12C-5+ phases.
