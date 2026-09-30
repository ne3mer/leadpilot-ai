# LeadPilot Premium Redesign — Phase 12C-0

**Document type:** Design audit & design direction  
**Scope:** Full product UI/UX (marketing + authenticated app)  
**Constraints:** No schema, RLS, auth behavior, AI API contracts, priority scoring/ranking, activity logic, or security boundaries may change as part of visual redesign.  
**Code status for this phase:** Documentation only — no application code modified.

---

## 1. Product Personality

LeadPilot should read as a **calm sales instrument**, not an “AI dashboard.” Target personality:

| Adjective | Visual meaning |
|-----------|----------------|
| **Calm** | Low chroma backgrounds, generous vertical rhythm, no competing accent colors. Motion is rare and functional. |
| **Precise** | Aligned grids, consistent control heights, numeric data in tabular figures, labels that match control width. |
| **Editorial** | Headlines carry hierarchy; body copy is short. Sections feel like magazine spreads, not widget grids. |
| **Trustworthy** | Deterministic data (status, score, timeline) looks stable and factual; AI output is clearly labeled but not neon-marketed. |
| **Intentional** | Every surface answers “why is this here?” Empty space is deliberate, not leftover. |
| **Human** | Copy is plain and specific; no hype pills (“Command Center,” “New Era”). Typography feels typeset, not templated. |
| **Focused** | One primary action per viewport region. Secondary tools recede until needed. |
| **Capable** | Density when useful (lead lists, activity logs) without decorative chrome; power users can scan fast. |

---

## 2. Current UI Diagnosis

Re-evaluation of the **current repository** (including Phase 12B-2 workflow labels, mobile pipeline cards, sender profile CTA, and priority presentation).

### Visual

- **Emerald gradient overload:** Primary buttons, KPI card top bars, landing hero orbs, dashboard hero blur, chart skeletons, and “Add Lead” all use the same green gradient language — reads as one repeated motif, not hierarchy.
- **Card sameness:** `Card` (`rounded-2xl`, `border-black/10`, `shadow-sm`) wraps hero, KPIs, priority list, pipeline, chart, AI panels, login, and lead detail sections — everything has equal visual weight.
- **AI violet lane:** `AiGeneratedLabel` uses violet borders/backgrounds while the product accent is emerald — AI feels bolted on, not native.
- **Decorative motion:** Framer Motion on header entrance, landing sections, and KPI hover lift (`whileHover={{ y: -6 }}`) adds energy without improving comprehension.
- **Glass / blur:** Sticky header `bg-white/90 backdrop-blur` and landing blurs echo generic SaaS landing patterns.
- **Icon boxes:** Priority Leads uses a rounded emerald icon tile — decorative container without informational value.

### Hierarchy

- **Dashboard stacks competing primaries:** Hero (“Command Center”) → nine KPI cards → Priority Leads → full Pipeline (with inline add-lead form) → Chart + AI Message — no single “start here” for a rep’s day.
- **Lead detail is a vertical deck of cards:** Phase 12B-2 step labels help semantically but each block still looks like the same card — workflow steps don’t yet change *visual* priority.
- **KPI grid duplicates pipeline knowledge:** Per-status counts (New, Contacted, …) repeat information available in filters and the pipeline; conversion + total might suffice at dashboard level.
- **AI Message Generator on dashboard** sits below the fold beside analytics — relationship to “Use in AI” from pipeline is easy to miss.

### Navigation

- **No active route indication** in `SiteHeader` for Dashboard / Leads / Profile.
- **“Leads” is a hash link** (`/dashboard#pipeline`) — works but feels ancillary to Dashboard, not a first-class view.
- **Email in header** truncates awkwardly; account/profile access is split between email display and a separate Profile nav item.
- **Marketing nav vs app nav** swap correctly by auth state, but visual treatment is identical — signed-in product doesn’t feel like a distinct shell.

### Information density

- **Pipeline section combines** create form, filters, desktop table, and mobile cards in one card — high cognitive load at the main working surface.
- **Priority Leads rows** show reasons + status pill + score badge + AI insight control — dense for a “top 5” summary.
- **Lead detail** repeats “next step” concepts across Priority Insight, Intelligence, and Message Generator (copy improved in 12B-2; visual grouping still weak).

### Interaction

- **Buttons:** Primary uses pill shape + gradient + shadow + hover translate — strong for marketing, heavy for dense tables.
- **Status editing:** Native `<select>` styled as colored pills (desktop table) or full-width selects (mobile) — functional but visually noisy when many rows show saturated status colors.
- **Delete:** Inline confirm on pipeline; `window.confirm` on lead detail delete — inconsistent pattern.
- **“Use in AI”** (WandSparkles) vs **“AI insight”** (Sparkles) — similar metaphors, different placements.

### Mobile

- **12B-2 mobile cards** improve overflow and expose actions — good baseline; cards still mirror desktop card chrome (border, shadow, many buttons per row).
- **Filters** remain a tall stack above the list — acceptable but not optimized as a compact “toolbar.”
- **Dashboard** on mobile is still the full desktop stack — hero + 9 KPIs before work surfaces.
- **No bottom nav** for signed-in app; hamburger exposes the same links as desktop.

### Accessibility

- **Strengths:** Many labels and `aria-label`s on status selects (12B-2); alertdialog on delete confirm; AI buttons have `aria-busy`.
- **Gaps:** Focus rings rely on `ring-emerald-400/40` inconsistently; violet AI badges may be low contrast at 10px uppercase; step labels are visual only (not always wired as landmarks); chart legend/tooltip contrast is default Recharts.

### AI UX

- **Three separate panel patterns** (insight button + violet/emerald result blocks, intelligence card with Brain, message generator with form fields) — same mental model (“get AI text”) with different layouts.
- **Sparkles / WandSparkles** reinforce “AI widget” trope.
- **Dashboard priority rows** embed per-row AI insight — scales poorly and draws attention away from “who to call.”

### Consistency

- **Typography:** Mix of `text-lg font-medium`, `text-lg font-semibold`, uppercase tracking `[0.16em]` step labels, and `text-xs uppercase` KPI labels — no documented scale.
- **Radius:** `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full` used interchangeably for controls vs containers.
- **Alerts:** Success/error use bordered tinted boxes — consistent but always full-width paragraphs, never inline field errors.
- **Spacing:** `gap-6` page rhythm vs `p-5`/`p-6`/`p-8` card padding — close but not tokenized.

---

## 3. Design Direction

### Typography philosophy

- **One family for UI:** Keep Geist Sans (already loaded) — neutral, modern, not “startup template” if used with restraint.
- **Hierarchy by size and weight only:** Display (page title) → Section title → Subsection → Body → Caption → Mono (IDs, timestamps optional).
- **Reduce uppercase tracking** to wayfinding micro-labels (optional section index), not every card subtitle.
- **Line length:** Cap prose to ~65ch; lead names and companies may break freely.

### Color philosophy

- **Base:** Warm-neutral paper background (not mint wash) + near-black text — calm canvas.
- **Accent:** Single restrained green for primary actions and positive pipeline motion — flat or barely perceptible tint shift, not gradients.
- **Semantic colors:** Status and priority use muted fills + strong text; avoid rainbow pills in dense lists.
- **AI:** Same neutral surface as rest of app; distinguish AI with typography (caption “Generated”) and a hairline border, not a second brand color (no default violet).

### Spacing philosophy

- **8px grid** (4/8/12/16/24/32/48/64) — document and enforce via tokens.
- **Page:** More air between major sections than between items inside a section.
- **Lists:** Tighter internal spacing than marketing pages.

### Surface philosophy

- **Default page = background**, not white card.
- **One elevation level** for “working surfaces” (pipeline table area, lead detail main column) — optional subtle fill (`surface-1`) vs page background.
- **Avoid nested cards** (card inside card on landing preview and KPI grid).

### Border philosophy

- **Hairline borders** at 6–8% black (or neutral-200) — separation without boxes.
- **Prefer dividers** between list rows over wrapping each row in a card (mobile pipeline can move toward list rows + divider).

### Shadow philosophy

- **Almost none** in app shell; elevation communicated by background step or border.
- **Marketing only:** At most one soft shadow on primary CTA if needed — not on every KPI.

### Radius philosophy

- **Controls:** Small radius (6–8px) — precise, tool-like.
- **Containers:** Slightly larger (10–12px) — do not use `rounded-full` for primary buttons in app (reserve pills for status chips if at all).
- **Consistency:** Two radii total in product UI.

### Icon philosophy

- **Functional icons only** (navigation, activity type, empty states).
- **Remove decorative** Sparkles/WandSparkles from default AI actions — replace with text labels (“Explain priority,” “Draft message”).
- **Stroke weight** matches Lucide defaults; 16–20px in rows, 20–24px in headers.

### Motion philosophy

- **No entrance animations** on dashboard data surfaces.
- **150–200ms** opacity/color for hover/focus; **no translate-y** on hover for data cards.
- **Respect `prefers-reduced-motion`.**

---

## 4. Design Tokens

Proposed CSS/Tailwind token set (names illustrative — implement in a later phase).

### Color

| Token | Role | Suggested value (light mode) |
|-------|------|------------------------------|
| `--bg-page` | Page background | `#f5f4f1` (warm gray) |
| `--bg-surface` | Primary working surface | `#ffffff` |
| `--bg-surface-subtle` | Grouped list background | `#fafaf9` |
| `--bg-elevated` | Modals, popovers | `#ffffff` |
| `--border-default` | Dividers, inputs | `rgb(0 0 0 / 0.08)` |
| `--border-strong` | Focus rings | `rgb(0 0 0 / 0.16)` |
| `--text-primary` | Headlines, body | `#0c0c0c` |
| `--text-secondary` | Descriptions | `#5c5c59` |
| `--text-muted` | Timestamps, hints | `#8a8a85` |
| `--accent` | Primary action, links | `#1a6b4a` (deep forest) |
| `--accent-muted` | Accent hover bg | `#e8f2ed` |
| `--success` | Confirmations | `#1a6b4a` |
| `--warning` | Caution | `#9a6700` |
| `--danger` | Delete, errors | `#b42318` |
| `--priority-high` | Text + subtle bg | `#0f5132` / `#e7f3ed` |
| `--priority-medium` | Text + subtle bg | `#7a5c00` / `#f5f0e0` |
| `--priority-low` | Text + subtle bg | `#525252` / `#f0f0ef` |

Status colors should map to **muted chips** (text + 8% fill), not saturated lime/emerald blocks in tables.

### Typography scale

| Token | Size / line | Use |
|-------|-------------|-----|
| `display` | 28–32px / 1.15 | Page title (once per view) |
| `title` | 20–22px / 1.25 | Section title |
| `heading` | 16–17px / 1.35 | Subsection, card title |
| `body` | 14–15px / 1.5 | Default UI |
| `caption` | 12–13px / 1.4 | Meta, labels |
| `micro` | 11px / 1.3 | Legal, badges (sparingly) |

### Spacing scale

`0, 4, 8, 12, 16, 24, 32, 48, 64, 96` — page section gaps at 48–64; form field gaps at 16.

### Radius scale

- `radius-sm` 6px — inputs, buttons  
- `radius-md` 10px — panels, modals  

### Shadow scale

- `shadow-none` — default  
- `shadow-focus` — focus ring only (box-shadow simulating ring)  
- `shadow-overlay` — dialogs only: `0 8px 32px rgb(0 0 0 / 0.12)`

### Motion

- `duration-fast` 120ms  
- `duration-normal` 180ms  
- `duration-slow` 280ms (modals only)  
- Easing: `cubic-bezier(0.25, 0.1, 0.25, 1)`  

---

## 5. Navigation

### Philosophy

Signed-in LeadPilot is a **workspace**, not a marketing site. Navigation should answer: *Where am I? What can I do next? Where is my account context?*

### Signed-out

- Minimal top bar: wordmark, product links (Features, Pricing if kept), **Sign in** as text link, **Open app** as secondary — no gradient pill required.
- Footer duplicates legal/login only.

### Signed-in

- **Persistent app shell:** wordmark → **Leads** (primary) → **Overview** (optional renamed dashboard) → **Profile** — order reflects daily workflow (work first, analytics second).
- **Desktop:** Horizontal text nav; active item = `text-primary` + 2px bottom border or weight shift — not emerald flood.
- **Mobile:** Consider **bottom tab bar** (Leads, Overview, Profile) for thumb reach; reserve hamburger for sign-out only if needed.
- **Account:** Profile nav + sign out; show email on Profile page, not in header (or single avatar/initials menu later — no new auth scope required for v1 redesign).

### Active state

- Derive from pathname + hash for pipeline anchor until Leads is a dedicated route (visual redesign can coincide with `/dashboard/leads` later — **not required for 12C**).

---

## 6. Dashboard

### Problem with current IA

Hero + nine KPI cards + priority + full pipeline + chart + AI treats **reporting** and **doing** as equals. For a sales workflow product, **action on leads** should dominate.

### Proposed hierarchy

**Primary (above the fold on laptop):**

1. **Page header** — “Leads” or “Today” with result count / last updated — no hero card.
2. **Focus strip** — Top 3–5 priority leads as a **compact list** (name, company, score, status) — tap to open detail. AI insight **not** inline per row; available on detail or via overflow “Explain.”
3. **Pipeline workspace** — Search + filters on one toolbar row; list/table as main surface.

**Secondary:**

4. **Quick metrics** — At most **three** numbers: Total active, Won rate (or Won count), Needs contact (derived from status — presentation only, same metrics logic). No nine-tile grid.
5. **Add lead** — Secondary action (button opens drawer/sheet or dedicated row) — not always-visible 5-field grid consuming vertical space.

**Tertiary:**

6. **Trend chart** — Collapsible or below fold on Overview tab.
7. **Draft follow-up** — Move to lead detail or a slide-over when “Prepare outreach” is chosen — dashboard should not host full message form by default.

### Remove / merge / reduce

| Current | Recommendation |
|---------|----------------|
| Dashboard hero card | Remove — replace with utilitarian page header |
| 9 KPI cards | Merge to 2–3 summary stats or link to Overview |
| Performance chart on main dashboard | Move to Overview / Analytics section |
| AI Message Generator on dashboard | Default hidden; open from lead context |
| Priority Leads section | Keep data, reduce chrome and row-level AI |
| Inline add-lead form | Collapse behind “Add lead” |

---

## 7. Leads

### Ideal experience

- **Toolbar:** Search (dominant width), status filter, priority filter, sort — single aligned row on desktop; on mobile, search sticky + “Filters” disclosure.
- **List:** Desktop = typed table (no min-width scroll if column priorities adjust); Mobile = **rows** with divider (name block, meta line, chevron) — open detail as primary gesture; status via explicit control (not whole-row tap).
- **Priority:** Score as `72 · Medium` text tabular badge — one component everywhere.
- **Status:** Muted chip when read-only; when editing, standard select with visible label — consider popover status picker later (UI only).
- **Actions:** Primary = open lead; secondary = overflow menu (Use for draft, Delete).
- **Delete:** Same inline confirm pattern everywhere (detail included — drop `window.confirm`).
- **Empty:** Illustration-free — one sentence + “Add lead” + link to import/help if needed.
- **Selection / Use in AI:** Reframe as “Draft follow-up” tied to selected lead — opens follow-up panel, not magic wand.

---

## 8. Lead Detail

### First glance → deep context

**Above the fold:**

- Lead name (display size), company, status chip, priority line, primary CTA (**Log activity** or **Draft follow-up**).
- Back link as text, not competing with title.

**Scroll narrative (visual weight decreases down-page):**

1. **Lead facts** — Email, dates; edit in place or sheet — not a full card if a simple dl on surface suffices.
2. **Priority** — Score + reasons (deterministic); optional collapsed “Explain with AI.”
3. **Activity** — Primary CRUD; this is where work happens.
4. **Timeline** — Collapsed by default or narrow column — chronological scan, line-clamp previews (12B-2 direction kept, visually lighter).
5. **AI guidance** — **One “Guidance” region** with tabs or segments: Insight | Intelligence | Draft — reduces three panels to one system.
6. **Follow-up** — If not merged into Guidance, appears as the last step when user chooses outreach.

### Redundancy avoidance

| Topic | Single source of truth |
|-------|------------------------|
| Chronology | Timeline (read-only) |
| CRUD | Activity panel |
| Numeric urgency | Priority summary |
| “Why / what next” (AI) | One guidance flow — insight vs intelligence vs draft are **modes**, not separate products |
| Sender profile hint | One quiet line in Guidance region when profile missing |

Phase 12B-2 step labels (`1 · Lead`, etc.) can evolve into **section indexes** without numbering every card.

---

## 9. AI UX

### Semantic distinction (user-facing language)

| Mode | User question answered | When visible |
|------|------------------------|--------------|
| **Priority explanation** | “Why is this score justified right now?” | Collapsed; on demand from Priority section |
| **Lead intelligence** | “What’s the situation and recommended approach?” | Inside Guidance; after user requests analysis |
| **Follow-up draft** | “What should I send?” | When user commits to outreach; form fields minimal (tone/objective) |

### Visual system (coherent, not three widgets)

- **Shared container:** `Guidance` surface with neutral background.
- **Shared result layout:** Title line (caption: “Generated”), body text, optional two-column “Approach / Next step” — same typography for all three modes.
- **No violet badge by default** — replace with caption text or subtle left border.
- **Loading:** Replace paragraph placeholders with inline status text (“Analyzing…”) — no shimmer skeletons for AI.
- **Errors:** Same inline alert component as rest of app.
- **Dashboard:** Do not show AI controls in priority list rows.

### On-demand default

AI never auto-runs on page load. Expanded state persists per session optionally (client UI state only).

---

## 10. Sender Profile

- **Profile page:** Settings-style form — grouped fields (Identity, Company, Messaging defaults), save bar sticky on long mobile scroll.
- **Missing profile:** One **muted inline hint** in Guidance / draft areas: “Add your profile to personalize drafts” — link to `/dashboard/settings/profile`. No banners, modals, or blocking gates (current 12B-2 CTA direction is correct; restyle to match tokens).
- **Complete profile:** No promotional UI — optional checkmark on Profile nav only.

---

## 11. Forms

### System

- **Labels above fields**, 12–13px caption weight; inputs 40–44px height, `radius-sm`, hairline border, focus = border-strong + outline.
- **Primary submit** right-aligned in footer bar for multi-field forms; single-column max width ~480px on profile.
- **Add lead:** 4 fields + status — use sheet/modal or dedicated strip; validate inline (duplicate email under field).
- **Edit lead:** Same controls as add; destructive delete separated visually.
- **Activity:** Type as segmented control (Note / Email / Call); content textarea min 3 rows.
- **Sender profile:** Section headings; optional fields marked; tone as select matching AI tone labels.

---

## 12. Empty / Loading / Error States

### Empty

- One line title + one line helper + one action. No dashed giant boxes unless list area needs boundary — prefer whitespace on page background.

### Loading

- **Initial page:** Static “Loading…” in section or subtle progress on header — avoid fake chart skeletons except first chart paint (optional simple pulse on chart area only).
- **Actions:** Disable control + label change (“Saving…”) — already partially implemented.

### Error

- **Inline** for form fields; **section alert** for load failures; retry button when data fetch fails.
- Same red token, no heavy red fill blocks — left border accent + text.

---

## 13. Responsive Strategy

### Desktop (≥1024px)

- Pipeline table with configurable columns; Guidance on lead detail as right column **or** bottom wide panel — two-column detail when width allows (activity + timeline left, guidance right).

### Tablet (768–1023px)

- Filters wrap to two rows; table may drop email column; detail stays single column — Guidance after activity.

### Mobile (<768px)

- **Gain priority:** Lead name, status, priority, primary open action.
- **Lose priority:** Chart, KPI grid, long reason lists (truncate to one line + “View lead”).
- **Navigation:** Bottom tabs preferred over deep scroll to sign-out.
- **AI:** Full-width Guidance accordion — one mode open at a time.

---

## 14. Motion

- Disable decorative page enter on app routes.
- Button press: background darken only — no lift.
- List insert/delete: optional 180ms height/opacity — only if it aids orientation.
- Modal/sheet: slide 280ms from bottom (mobile) or fade (desktop).
- Chart: no animation on line draw for first load (accessibility + calm).

---

## 15. Anti-Patterns (strict — do not ship)

1. Emerald gradient primary buttons in authenticated app  
2. Violet (or any second-brand) AI color system  
3. Sparkles / magic-wand icons on AI actions  
4. KPI grids with more than four tiles on main workflow page  
5. Nested `Card` components  
6. `whileHover` translate on data tiles  
7. Large blurred gradient orbs behind content  
8. Glassmorphism headers in app shell (solid or flat translucency only if needed)  
9. Uppercase tracking labels on every section  
10. “Command Center,” “New Era,” or equivalent hype copy in product UI  
11. Per-row AI buttons in dashboard lists  
12. `rounded-full` primary CTAs in dense app views  
13. Decorative dashboard preview fake metrics on landing (replace with real product screenshot or abstract UI silhouette)  
14. Rainbow status pills in every table cell — use neutral row + one status column  
15. Multiple shadows stacked on one viewport  
16. AI-generated badges on every AI surface — caption text is enough  
17. Horizontal scroll tables on mobile (already mitigated — do not regress)  
18. `window.confirm` for destructive actions  

---

## 16. Component Strategy

Foundation library to build or refactor (names indicative):

| Component | Responsibility |
|-----------|----------------|
| **Button** | Variants: primary (flat accent), secondary (outline), ghost, danger — shared heights |
| **Input / Textarea / Select** | Shared field wrapper + label + error text |
| **Badge** | Priority, status — muted variants only |
| **Section** | Optional index label + title + description — replaces repeated workflow header + card title |
| **Surface** | Page-level grouping without shadow — optional subtle bg |
| **PageHeader** | Title, actions slot, meta line |
| **DataList / DataTable** | Pipeline desktop + mobile row modes |
| **Toolbar** | Search + filters + sort |
| **EmptyState** | Icon optional — text + action |
| **InlineAlert** | Success, error, warning |
| **ConfirmInline** | Delete pattern |
| **GuidancePanel** | Unified AI modes container |
| **GeneratedContent** | Caption + prose for AI output (replaces AiGeneratedLabel-heavy pattern) |
| **PriorityIndicator** | Wraps score line + aria label |
| **StatusIndicator** | Read-only chip + editable select variant |
| **Sheet / Dialog** | Add lead, future mobile filters |
| **AppShell** | Header + nav + main — separate from marketing `SiteHeader` |

Keep **`LeadPriorityBadge`**, **`LeadStatusSelectOptions`**, list-view logic — restyle wrappers only in implementation phases.

---

## 17. Implementation Order

Recommended sequence (high impact first, still no logic changes):

1. **Tokens + globals** — colors, spacing, radius, type scale in `globals.css` / Tailwind theme; remove mint default background.  
2. **App shell + navigation** — signed-in header, active states, optional bottom nav mobile; separate marketing shell styling.  
3. **Primitives** — Button, Input, Badge, Section, PageHeader, InlineAlert (replace ad hoc classes).  
4. **Dashboard IA cut** — remove hero KPI explosion; compact metrics; collapse add-lead; simplify priority list.  
5. **Leads pipeline** — Toolbar + DataTable/DataList; mobile rows; status/priority restyle.  
6. **Lead detail** — PageHeader, surface hierarchy, timeline/activity visual differentiation; unified delete confirm.  
7. **GuidancePanel** — merge AI UX visually (keep three API calls behind modes).  
8. **Sender profile + forms** — apply field system.  
9. **Marketing pages** — align with new tokens but allow slightly more expressiveness (still no gradient abuse).  
10. **Motion pass** — strip decorative Framer from app; reduced-motion.  
11. **Accessibility pass** — focus, contrast, landmarks for sections.  
12. **Polish** — chart styling, empty states, landing screenshot.

---

## Appendix A — Files inspected (Phase 12C-0)

- `app/globals.css`, `app/layout.tsx`, `app/page.tsx`
- `app/login/page.tsx`, `app/login/login-form.tsx`
- `app/dashboard/page.tsx`, `app/dashboard/dashboard-shell.tsx`
- `app/dashboard/leads/[id]/page.tsx`, `app/dashboard/leads/[id]/lead-detail-panel.tsx`, `app/dashboard/leads/[id]/not-found.tsx`
- `app/dashboard/settings/profile/page.tsx`
- `app/case-study/page.tsx` (referenced in tree)
- `components/layout/site-header.tsx`, `site-footer.tsx`
- `components/ui/button.tsx`, `card.tsx`, `container.tsx`, `section-heading.tsx`, `ai-generated-label.tsx`
- `components/sections/landing/hero.tsx`, `features.tsx`, `dashboard-preview.tsx`, `pricing.tsx`
- `components/sections/dashboard/dashboard-hero.tsx`, `stats-overview.tsx`, `priority-leads.tsx`, `leads-table.tsx`, `performance-chart.tsx`, `ai-message-panel.tsx`, `ai-lead-intelligence-panel.tsx`, `lead-activity-panel.tsx`, `lead-timeline.tsx`, `sender-profile-form.tsx`
- `components/leads/lead-priority-badge.tsx`, `lead-priority-summary.tsx`, `lead-priority-insight.tsx`, `lead-pipeline-mobile-card.tsx`, `lead-detail-workflow-header.tsx`, `lead-status-select-options.tsx`, `sender-profile-ai-cta.tsx`
- `components/auth/sign-out-button.tsx`
- `lib/app-navigation.ts`, `lib/leads/priority-types.ts`

---

## Appendix B — Phase 12C-0 deliverable summary

**Design direction summary:** LeadPilot becomes a warm-neutral, editorial sales workspace — flat accent, hairline structure, typography-led hierarchy, unified Guidance for AI, Leads-first dashboard IA.

**Biggest current problems:** Card/grid sameness, emerald gradient + KPI overload, AI as violet side-brand, decorative motion, dashboard IA that prioritizes reporting over lead action, inconsistent delete patterns, nav without active workspace feel.

**Proposed visual language:** Original “quiet instrument” — forest accent on paper gray, two radii, minimal shadow, muted status/priority chips, text-first AI disclosure, section indexes instead of marketing hero cards.

**Recommended implementation order:** See §17 (tokens → shell → primitives → dashboard IA → leads → detail → Guidance → forms → marketing → motion → a11y → polish).

**Application code changed in Phase 12C-0:** None — this document only.
