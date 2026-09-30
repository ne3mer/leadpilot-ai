# LeadPilot Design System — Implementation Reference

**Phase:** 12C-1 Foundation  
**Direction:** [leadpilot-premium-redesign.md](./leadpilot-premium-redesign.md) — *Quiet Instrument*  
**Source of truth for tokens:** `leadpilot-ai/app/globals.css`

This document describes the design system primitives future redesign phases must use.

---

## 1. Color tokens

All colors are CSS variables on `:root`. Tailwind utilities map via `@theme inline` (e.g. `bg-page`, `text-primary`, `border-border`, `bg-accent`).

### Background

| Token | Variable | Use |
|-------|----------|-----|
| Page | `--lp-bg-page` | App canvas (warm paper gray) |
| Surface | `--lp-bg-surface` | Working panels, inputs |
| Surface subtle | `--lp-bg-surface-subtle` | Grouped lists, ghost hover |
| Surface elevated | `--lp-bg-surface-elevated` | Modals (same fill as surface; elevation via shadow) |

### Text

| Token | Variable |
|-------|----------|
| Primary | `--lp-text-primary` |
| Secondary | `--lp-text-secondary` |
| Muted | `--lp-text-muted` |
| Inverse | `--lp-text-inverse` |

### Borders

| Token | Variable |
|-------|----------|
| Default | `--lp-border-default` |
| Subtle | `--lp-border-subtle` |
| Strong | `--lp-border-strong` |

### Accent

| Token | Variable |
|-------|----------|
| Accent | `--lp-accent` |
| Hover | `--lp-accent-hover` |
| Muted fill | `--lp-accent-muted` |
| On accent | `--lp-accent-foreground` |

### Semantic

| Role | Foreground | Muted background |
|------|------------|------------------|
| Success | `--lp-success` | `--lp-success-muted` |
| Warning | `--lp-warning` | `--lp-warning-muted` |
| Danger | `--lp-danger` | `--lp-danger-muted` |

### Priority (badge utilities)

Classes: `.lp-priority-high`, `.lp-priority-medium`, `.lp-priority-low`  
Applied via `priorityLevelBadgeClassName()` in `lib/leads/priority-types.ts`.

### Status (badge utilities)

Classes: `.lp-status-new`, `.lp-status-contacted`, `.lp-status-qualified`, `.lp-status-proposal`, `.lp-status-negotiation`, `.lp-status-won`, `.lp-status-lost`  
Applied via `leadStatusSelectClassName()` in `components/leads/lead-status-select-options.tsx`.

**Rules:** Flat colors only. No gradients. AI uses accent/neutral — not a separate purple system.

---

## 2. Typography

Semantic classes in `globals.css` (also exported from `lib/design-system/typography.ts`):

| Role | Class | Approx size |
|------|-------|-------------|
| Display | `.lp-text-display` | 32px / semibold |
| Page title | `.lp-text-page-title` | 28px / semibold |
| Section title | `.lp-text-section-title` | 20px / medium |
| Subsection | `.lp-text-subsection` | 17px / medium |
| Body | `.lp-text-body` | 15px |
| Body small | `.lp-text-body-small` | 14px / secondary |
| Metadata | `.lp-text-metadata` | 13px / muted |
| Caption | `.lp-text-caption` | 12px / muted |

**Font:** Geist Sans (existing). Do not add fonts without explicit approval.

**Weight:** Prefer medium (500) for section titles; semibold (600) only for page/display level.

---

## 3. Spacing

Base scale (CSS variables):

`--lp-space-1` (4px) through `--lp-space-16` (64px)

Semantic:

| Token | Variable | Use |
|-------|----------|-----|
| Section gap | `--lp-space-section` | Between major page blocks (48px) |
| Surface padding | `--lp-space-surface-padding` | Default inner surface padding (20px) |
| Form gap | `--lp-space-form-gap` | Between form fields |
| Table row | `--lp-space-table-row-y` | Vertical rhythm in tables |

Use spacing before adding containers.

---

## 4. Radius

| Token | Variable | Use |
|-------|----------|-----|
| Small | `--lp-radius-sm` (6px) | Buttons, inputs, badges |
| Medium | `--lp-radius-md` (10px) | Surfaces, cards |
| Large | `--lp-radius-lg` (14px) | Rare — modals only if needed |

Tailwind: `rounded-sm`, `rounded-md`, `rounded-lg` map to these tokens.

**Do not** use `rounded-full` for primary buttons in app UI.

---

## 5. Borders

Default border color is set globally on `*`. Use `border-border`, `border-border-subtle`, `border-border-strong` for emphasis.

**Hairline dividers:** `<hr className="border-0 border-t border-border" />` or section `divider` prop on `Section`.

---

## 6. Shadows

| Token | Variable | Use |
|-------|----------|-----|
| None | default | Almost everything |
| Focus | `--lp-shadow-focus` | `:focus-visible` via `.lp-focus-ring` |
| Overlay | `--lp-shadow-overlay` | `Surface` elevated variant only |

No decorative shadows on KPI tiles or marketing-style cards in app shell.

---

## 7. Motion

| Token | Variable |
|-------|----------|
| Fast | `--lp-duration-fast` (120ms) |
| Normal | `--lp-duration-normal` (180ms) |
| Slow | `--lp-duration-slow` (280ms) |
| Easing | `--lp-ease-default` |

**Rules:** State change, focus, expansion, feedback only. `prefers-reduced-motion` zeroes transitions in `globals.css`.

---

## 8. Buttons

**Module:** `components/ui/button.tsx`

**Variants:** `primary` | `secondary` | `ghost` | `danger` | `dark` (legacy marketing)

**API:** `Button` component and `buttonClassName(variant, className?)` — preserve existing imports.

**Visual:** Compact, `rounded-sm`, flat accent, `.lp-focus-ring`, no gradients or hover translate.

---

## 9. Inputs

**Module:** `components/ui/input.tsx`

**Exports:**

- `inputClassName`, `selectClassName`, `textareaClassName`
- `fieldLabelClassName`, `fieldHintClassName`, `fieldErrorClassName`
- `Input`, `Select`, `Textarea` components

**Control height:** `--lp-control-height` (40px)

**Focus:** `.lp-focus-ring` — subtle double-ring, not large glow.

**Error:** pass `error` prop or `state: "error"` to class helpers → `border-danger`.

Migrate forms in later phases; do not invent one-off field styles.

---

## 10. Surfaces

Prefer this hierarchy:

1. **Plain content** — typography + spacing only  
2. **Section** — `components/ui/section.tsx` (title, description, optional divider)  
3. **Surface subtle** — `components/ui/surface.tsx` `variant="subtle"`  
4. **Surface elevated** — `variant="elevated"` (overlay shadow only)

**Card** (`components/ui/card.tsx`): backward-compatible bordered surface **without default padding**. Existing pages still pass `p-5` etc. New work should question whether a Card is needed at all.

---

## 11. Badges

**Module:** `components/ui/badge.tsx` — semantic tones: `neutral` | `accent` | `success` | `warning` | `danger`

**Lead priority:** `LeadPriorityBadge` — tabular nums, `rounded-sm`, token priority classes.

**Lead status:** muted token classes via `leadStatusSelectClassName`.

Score line format remains `72 · Medium` (text + color, not color alone).

---

## 12. AI disclosure

**Module:** `components/ui/ai-generated-label.tsx`

**Class:** `.lp-ai-disclosure` — left border, caption text, muted color.

**Variants:** `disclosure="generated" | "draft" | "assisted"` (legacy `variant` prop still supported).

No purple, uppercase pills, or sparkle decoration.

---

## 13. Icons

**Module:** `lib/design-system/iconography.ts`

- `iconClassName(size?, className?)` — default muted  
- `iconAccentClassName(size?, className?)` — accent emphasis only  

Sizes: `sm` 16px, `md` 20px, `lg` 24px.

Icons support scanning; avoid decorative icon tiles.

---

## 14. Containers

**Module:** `components/ui/container.tsx`

- Max width: `--lp-container-max` (1280px / 80rem)  
- Gutters: `--lp-gutter-mobile` / `--lp-gutter-desktop`  
- `wide` prop: full width with gutters only  

---

## 15. Accessibility

- All interactive primitives use `.lp-focus-ring` for visible keyboard focus.  
- Priority and status include text labels (score line, status name).  
- `prefers-reduced-motion` respected globally.  
- Disabled: `opacity-50` + `pointer-events-none` on buttons.  
- AI disclosure uses `role="note"`.  
- Do not rely on color alone — keep text in badges and alerts.

---

## 16. Anti-patterns

Do **not** introduce in future phases:

1. Emerald/violet gradients on buttons or heroes (app shell)  
2. Purple AI styling  
3. `rounded-full` primary CTAs in dense UI  
4. Hover translate on data cards  
5. Nested cards without semantic reason  
6. Shadow-sm on every block  
7. Sparkles as default AI iconography  
8. Uppercase tracking on every section label  
9. Arbitrary Tailwind colors outside tokens  
10. Decorative Framer Motion on dashboard data  

When unsure: remove visual noise, use spacing, use neutral.

---

## 17. File map

| Path | Purpose |
|------|---------|
| `app/globals.css` | Tokens + utility classes |
| `lib/design-system/*` | Typography & icon helpers |
| `components/ui/button.tsx` | Buttons |
| `components/ui/input.tsx` | Form controls |
| `components/ui/badge.tsx` | Generic badges |
| `components/ui/card.tsx` | Legacy container |
| `components/ui/surface.tsx` | Subtle/elevated surfaces |
| `components/ui/section.tsx` | Editorial sections |
| `components/ui/container.tsx` | Page width & gutters |
| `components/ui/ai-generated-label.tsx` | AI provenance |
| `components/leads/lead-priority-badge.tsx` | Priority display |
| `lib/leads/priority-types.ts` | Priority badge classes |
| `components/leads/lead-status-select-options.tsx` | Status badge classes |

---

## 18. Phase 12C-1 scope note

Foundation only — page sections (dashboard hero, KPI motion, landing blurs) are **not** redesigned yet. They inherit updated Card/Button/Badge/AI label tokens where those components are used. Full layout IA changes belong to 12C-2+.
