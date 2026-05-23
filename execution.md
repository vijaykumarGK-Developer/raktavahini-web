# Rakta-Vahini — Execution Strategy

> A practical build plan accounting for LLM + Opencode constraints

---

## 1. Capability Assessment

### Model: `deepseek-v4-flash-free`

| Trait | Implication |
|---|---|
| **Flash-tier** | Optimized for speed, not depth. Complex multi-file logic risks inconsistency. Keep each generation self-contained. |
| **Limited context window** | Cannot hold the full project in memory. The model will "forget" earlier files. Each turn must re-read relevant files before editing. |
| **No persistent state** | Every session starts fresh. All decisions must be captured in files (types, conventions) not in conversation. |
| **No visual feedback** | Cannot see the UI. Pages must be verified by the human via `npm run dev`. |
| **Free tier** | Rate limits may interrupt long chains. Prefer short, focused turns over marathon sessions. |

### Opencode Agentic IDE

| Tool | Can Do | Cannot Do |
|---|---|---|
| `write` | Create/edit files, one at a time | Generate a 500-line file in one shot (token limit) |
| `edit` | Replace exact strings in files | Handle complex refactors across files |
| `bash` | Run npm install, builds, grep | Run interactive prompts (`npm init` needs flags) |
| `glob`/`grep` | Find files and patterns | Understand semantic intent |
| sub-agents | Delegate focused tasks | Use a better model — all agents share the same underlying model |

### Key Constraint

**The model writes code in isolation then stops. It cannot:**
- Watch file changes and iterate visually
- Debug runtime errors it cannot see
- Test the app end-to-end

**The human must:**
- Run `npm run dev` and report visual issues
- Run `npm run build` after every phase
- Give feedback on what's broken

---

## 2. Strategy: Build in Layers, Verify at Each Floor

```
                        ┌──────────────────┐
                        │   Phase 5: Polish │  ← human QA pass
                        └────────┬─────────┘
                                 │
                        ┌────────▼─────────┐
                        │ Phase 4: Features │  ← verify all pages work
                        │  (pages 5-12)     │
                        └────────┬─────────┘
                                 │
                        ┌────────▼─────────┐
                        │ Phase 3: Core     │  ← verify search + registration
                        │  (pages 1-4)      │
                        └────────┬─────────┘
                                 │
                        ┌────────▼─────────┐
                        │ Phase 2: Data     │  ← verify Firestore reads/writes
                        │  (hooks + types)  │
                        └────────┬─────────┘
                                 │
                        ┌────────▼─────────┐
                        │ Phase 1: Skeleton │  ← verify npm run build passes
                        │  (scaffold + UI)  │
                        └──────────────────┘
```

**Golden rule: Build must pass after every phase before moving on.**

---

## 3. Execution Phases

### Phase 1 — Skeleton (human runs commands, model writes config files)

**Goal:** A bootable Vite project with routing and placeholders.

| Step | Who | Action | Verify |
|---|---|---|---|
| 1.1 | **Human** | `npm create vite@latest . -- --template react-ts` | Project exists |
| 1.2 | **Human** | `npm install` | No errors |
| 1.3 | **Human** | `npm install react-router-dom firebase` | deps installed |
| 1.4 | **Human** | `npm install -D tailwindcss @tailwindcss/vite` | devDeps installed |
| 1.5 | **Human** | `npx shadcn@latest init -d --force` | shadcn configured |
| 1.6 | **Human** | `npx shadcn@latest add button card input select switch slider sheet dialog toast dropdown-menu navigation-menu tabs textarea badge separator skeleton` | components added |
| 1.7 | **Model** | Write `src/lib/firebase.ts` | Correct credentials |
| 1.8 | **Model** | Write `src/lib/utils.ts` (Haversine, smart score, eligibility) | Pure functions |
| 1.9 | **Model** | Write `src/lib/constants.ts` | `bloodGroups` array |
| 1.10 | **Model** | Write `src/types/index.ts` | All 4 interfaces |
| 1.11 | **Model** | Write `src/index.css` | Tailwind + brand colors |
| 1.12 | **Model** | Write `src/App.tsx` | Routes with placeholders |
| 1.13 | **Model** | Write `src/pages/Layout.tsx` | Navbar + tabs + FAB |
| 1.14 | **Model** | Write ALL shared UI components (8 files) | Each a single default export |
| 1.15 | **Model** | Write ALL placeholder pages (13 files) | Each exports a named component |
| 1.16 | **Model** | Write `src/providers/ThemeProvider.tsx` | Dark mode toggle |
| 1.17 | **Human** | `npm run build` | **Must pass** |

**Human check:** Open `npm run dev`, confirm all routes render, dark mode works, navbar tabs appear.

---

### Phase 2 — Data Layer (model writes hooks, human checks Firestore)

**Goal:** All Firestore hooks working, real-time data flowing.

| Step | Who | Action | Verify |
|---|---|---|---|
| 2.1 | **Model** | Write `src/hooks/useDonors.ts` | `useDonors()` + `addDonor()` + `updateDonor()` |
| 2.2 | **Model** | Write `src/hooks/useHospitals.ts` | `useHospitals()` + `addHospital()` + `updateHospital()` |
| 2.3 | **Model** | Write `src/hooks/useDonationLogs.ts` | `useDonationLogs()` + `addDonationLog()` |
| 2.4 | **Model** | Write `src/hooks/useEmergencies.ts` | `useEmergencies()` + `broadcastEmergency()` |
| 2.5 | **Model** | Write `src/hooks/useAuth.ts` | `useAuth()` + `signInWithGoogle()` + `signOut()` |
| 2.6 | **Model** | Write `src/hooks/useCurrentUser.ts` | `useCurrentUser()` + `updateCurrentUser()` |
| 2.7 | **Model** | Write `src/providers/AuthProvider.tsx` | Wraps Firebase `onAuthStateChanged` |
| 2.8 | **Model** | Write `src/providers/FirestoreProvider.tsx` | Optional — can use raw `useDonors` instead |
| 2.9 | **Human** | `npm run build` | **Must pass** |
| 2.10 | **Human** | Check Firebase Console → verify collections are readable | Data accessible |

**Human check:** Open browser console, confirm Firestore connection succeeds (no CORS/auth errors). The existing Android collections should be readable.

---

### Phase 3 — Core Features (model writes pages, human tests each)

**Goal:** Search, Registration, List pages work end-to-end.

**Important:** Generate ONE page per turn. Do NOT batch pages — the model's context will overflow and code quality will drop.

| Step | Who | Action | Verify |
|---|---|---|---|
| 3.1 | **Model** | Write `SearchPage.tsx` | Blood group dropdown, radius slider, donor list with smart scores |
| 3.2 | **Human** | `npm run dev` → test search page | Report issues to model |
| 3.3 | **Model** | Fix SearchPage issues | Rerun and confirm |
| 3.4 | **Human** | `npm run build` | Pass |
| 3.5 | **Model** | Write `UserRegistrationPage.tsx` | Form with all fields + validation |
| 3.6 | **Human** | Test registration form, submit to Firestore | Check Firebase Console for new doc |
| 3.7 | **Model** | Fix registration issues | |
| 3.8 | **Model** | Write `HospitalRegistrationPage.tsx` | Hospital form |
| 3.9 | **Human** | Test hospital registration | |
| 3.10 | **Model** | Write `DonorsPage.tsx` + `UserDetailModal` | List donors, modal on click |
| 3.11 | **Model** | Write `HospitalsPage.tsx` + `HospitalDetailModal` | List hospitals, modal on click |
| 3.12 | **Model** | Write `HistoryPage.tsx` | Donation logs with segmented control |
| 3.13 | **Human** | `npm run build` | **Must pass** |
| 3.14 | **Human** | Full walkthrough: register a donor → see them in Donors → see on Search → log a donation → see in History | All flows work |

---

### Phase 4 — Advanced Features (model writes pages, human tests)

**Goal:** Emergency SOS, Certificate, Settings, Profile Edit, static pages.

| Step | Who | Action | Verify |
|---|---|---|---|
| 4.1 | **Model** | Write `EmergencyPage.tsx` | Blood group + units + SOS broadcast |
| 4.2 | **Human** | Test SOS broadcast → check Firestore `emergencies` collection | Document created |
| 4.3 | **Human** | `npm run build` | Pass |
| 4.4 | **Model** | Write `CertificatePage.tsx` | Certificate card with print button |
| 4.5 | **Model** | Write `SettingsPage.tsx` | Dark mode, links to profile edit, about, privacy, contact, logout |
| 4.6 | **Model** | Write `ProfileEditPage.tsx` | Pre-filled form, update user |
| 4.7 | **Model** | Write `AboutPage.tsx`, `PrivacyPage.tsx`, `ContactPage.tsx` | Static content |
| 4.8 | **Human** | `npm run build` | **Must pass** |
| 4.9 | **Human** | Full walkthrough: all 12 pages render, all links work, dark mode persists across navigation | |

---

### Phase 5 — Map Integration (model writes maps, human verifies visually)

**Goal:** Leaflet maps with donor markers, radius circles, location picker.

| Step | Who | Action | Verify |
|---|---|---|---|
| 5.1 | **Human** | `npm install leaflet react-leaflet @types/leaflet` | deps installed |
| 5.2 | **Model** | Write `src/hooks/useGeolocation.ts` | Geolocation hook with loading/error states |
| 5.3 | **Model** | Write `src/components/map/Markers.tsx` | Custom blood group divIcons |
| 5.4 | **Model** | Write `src/components/map/DonorMap.tsx` | Full map with markers + radius circle |
| 5.5 | **Model** | Write `src/components/map/LocationPicker.tsx` | Draggable marker for forms |
| 5.6 | **Model** | Write `src/components/map/RadiusSliderMap.tsx` | Combined map + slider |
| 5.7 | **Human** | `npm run build` | Fix any Leaflet type/import errors |
| 5.8 | **Human** | Visually verify: map tiles load, markers show blood groups, radius circle renders, geolocation prompt works | Report issues |

**Map gotchas (common build failures):**
- Leaflet CSS must be imported (`import "leaflet/dist/leaflet.css"`)
- Default marker icons break in bundlers — need custom `divIcon` (already planned)
- `react-leaflet` requires `MapContainer` children pattern, not imperative `L.map()`

---

### Phase 6 — Polish (model writes fixes, human QA)

**Goal:** Production-ready quality.

| Step | Who | Action |
|---|---|---|
| 6.1 | **Human** | Full QA pass — test every page, every button, every form |
| 6.2 | **Human** | Report all issues to model |
| 6.3 | **Model** | Fix reported issues one at a time |
| 6.4 | **Human** | `npm run build` | **Must pass** |
| 6.5 | **Human** | Deploy to Vercel/Netlify/Firebase Hosting |

---

## 4. Session Structure Template

For each coding session, follow this template:

```
Session goal: [ONE concrete goal, e.g. "Build SearchPage"]
Files to read first: [list files the model must read]
Files to create/modify: [list]
Human must do after: [commands to run, things to check]
Fallback: [what to do if build fails]
```

**Example session card:**

```
## Session: SearchPage

Read first:
- src/types/index.ts
- src/lib/utils.ts
- src/hooks/useDonors.ts
- src/components/shared/DonorCard.tsx
- src/components/shared/SkeletonCard.tsx

Create:
- src/pages/SearchPage.tsx

Modify:
- None (new page)

After session:
- npm run build
- npm run dev → go to /search
- Test: select blood group, move radius slider, click "Fetch My Live Location"
- Report: does the donor list appear? Are smart scores correct? Does loading show?

Fallback:
- If build fails: paste error output, model fixes one error at a time
- If map doesn't show: skip map integration (Phase 5), use list-only search
```

---

## 5. Risk Mitigation

| Risk | Likelihood | Mitigation |
|---|---|---|
| Build breaks after a phase | High | Never batch more than 1-2 files per turn. Run build after every change. |
| Model forgets project conventions | High | The human must remind the model to re-read key files (types, skill) each session. |
| Firebase CORS/auth errors | Medium | Use the same Firebase project as Android — it's already configured. Test with existing data first. |
| Leaflet marker icons broken | High | Use `L.divIcon` (custom HTML markers) instead of default `L.icon` — planned in map-specialist. |
| Model hits token limit mid-file | Medium | Keep each file under 200 lines. Split large pages (e.g., SearchPage) into sub-components. |
| Free tier rate limit | Medium | If model stops responding, wait 60s and retry. Keep prompts concise. |
| `shadcn/ui` version mismatch | Low | Pin versions. If `npx shadcn@latest` fails, use `npx shadcn-ui@latest` (legacy name). |
| Sub-agent delegation unreliable | High | **Don't rely on sub-agents with this model.** Write agents as reference docs, but run sessions manually. Sub-agents are aspirational for when you upgrade the model. |

---

## 6. Alternative Path: Minimal Viable App

If the model struggles with complexity, fall back to this **MVP scope**:

| Feature | Page | Why Keep |
|---|---|---|
| 1 | Donor search (list only, no map) | Core value |
| 2 | User registration | Must onboard |
| 3 | Donors list | Network visibility |
| 4 | Emergency SOS broadcast | Life-saving feature |
| 5 | Settings (dark mode only) | UX |

**Drop until Phase 6 if struggling:**
- Map integration (search works as card list)
- Certificate page (nice-to-have)
- Hospital registration (can reuse from Android)
- History page (can read from Android)
- Static pages (About, Privacy, Contact)

```
MVP flow:
Register → appear in Donors → get found via Search → receive SOS → donate
```

This covers the critical path: **a donor registers, gets discovered, and responds to emergencies.**

---

## 7. File Size Budget

The model generates more reliably when files are small. Enforce these limits:

| File Type | Max Lines | Action if exceeded |
|---|---|---|
| Page component | 250 lines | Split into sub-components |
| Hook | 80 lines | Keep focused |
| Shared component | 100 lines | Extract parts |
| Provider | 60 lines | Keep simple |
| CSS | 150 lines | Use Tailwind utilities instead |

**Example split for SearchPage:**
```
SearchPage.tsx          → 150 lines (state + layout)
SearchFilters.tsx       → 60 lines  (dropdown + slider)
SearchResults.tsx       → 80 lines  (donor list + empty state)
SearchMapSection.tsx    → placeholder (filled in Phase 5)
```

---

## 8. Quick Reference: Human's Role

```
BEFORE each session:
  1. Read execution.md to know which phase you're on
  2. Open the session card for this step
  3. Clear context — start fresh conversation

DURING each session:
  4. Tell the model which phase/step
  5. Remind it to read relevant files first
  6. Review generated code briefly (check for obvious issues)
  7. After model finishes: npm run build
  8. If build fails: paste error, ask model to fix
  9. If build passes: npm run dev, visually verify

AFTER each session:
  10. Commit to git
  11. Mark phase complete in execution.md
  12. Move to next session card
```

---

## 9. Quick Reference: Model Prompt Template

Copy-paste this at the start of every session:

```
I am building Rakta-Vahini web app (blood donation network).
We are in Phase [X], Step [Y].
Goal: [one concrete goal]

Before writing code, read these files:
- [file1] — [purpose]
- [file2] — [purpose]

Rules:
- Follow the `react-firebase-hooks-pattern` skill for Firestore
- Keep each file under 200 lines
- Use Tailwind classes, not inline styles
- Use shadcn/ui components from src/components/ui/
- Handle loading, error, and empty states
- Export each component as default

After writing code, tell me to run:
npm run build
npm run dev
```
