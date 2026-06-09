# Rakta-Vahini Web — Technical Documentation

> **Live Site:** <https://vijaykumargk-developer.github.io/raktavahini-web/>
>
> **Repository:** <https://github.com/vijaykumarGK-Developer/raktavahini-web>

---

## Table of Contents

- [Architecture](#architecture)
- [Component Reference](#component-reference)
- [Hooks API](#hooks-api)
- [Utility Functions](#utility-functions)
- [Data Types](#data-types)
- [Firestore Schema & Security](#firestore-schema--security)
- [Route Table](#route-table)
- [State Management](#state-management)
- [Theming](#theming)
- [Build & Deploy Configuration](#build--deploy-configuration)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [Security](#security)
- [Changelog](#changelog)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)

---

## Architecture

### Application Layers

```
┌──────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                            │
│  React 19 SPA — 14 pages, Layout shell, router, providers            │
├──────────────────────────────────────────────────────────────────────┤
│                        HOOKS LAYER  (custom hooks)                   │
│  useAuth · useCurrentUser · useDonors · useHospitals                 │
│  useDonationLogs · useEmergencies                                    │
├──────────────────────────────────────────────────────────────────────┤
│                        SERVICE LAYER  (lib/)                         │
│  firebase.ts  →  Firebase init & env validation                      │
│  utils.ts     →  Haversine, smart scoring, validators                │
│  constants.ts →  Blood group list                                    │
├──────────────────────────────────────────────────────────────────────┤
│                        BACKEND LAYER  (Firebase)                     │
│  Cloud Firestore  — 4 collections, real-time listeners              │
│  Firebase Auth    — Google OAuth provider                            │
│  Security Rules   — Public read, owner-write                         │
└──────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action (tap search, register, SOS, donate)
        │
        ▼
Page Component (SearchPage, EmergencyPage, …)
        │
        ▼
Custom Hook (useDonors, useEmergencies, …)
        │
        ├── Firestore onSnapshot() ──► real-time subscription (reads)
        └── Firestore setDoc() / addDoc() ──► write operation
                │
                ▼
Snapshot callback fires, hook updates state
        │
        ▼
React re-renders affected components
```

### Smart Scoring Algorithm

```
smartScore = calcDist + (responseSpeed × 0.1) + (activeDaysAgo × 0.5) − (freq × 0.2)
```

| Component         | Weight  | Effect                              |
|-------------------|---------|-------------------------------------|
| `calcDist`        | × 1.0   | Distance from searcher (km)         |
| `responseSpeed`   | × 0.1   | Historical response speed rating    |
| `activeDaysAgo`   | × 0.5   | Days since last activity            |
| `freq`            | × −0.2  | Lifetime donation count (discount)  |

Lower score = better match.

### Eligibility Check

```ts
const daysSince = Date.now() - donor.lastDonationMs;
const isEligible = daysSince > 90 * 86_400_000;  // 90-day cooling period
```

---

## Component Reference

### Pages (`src/pages/`)

| Component                 | Path                    | Description                                      |
|---------------------------|-------------------------|--------------------------------------------------|
| `Layout`                  | `/` (wrapper)           | Header, bottom nav, SOS FAB, auth controls       |
| `SearchPage`              | `/search`               | Map+list donor discovery, radius slider, filters |
| `UserRegistrationPage`    | `/register`             | Donor profile form with map location picker      |
| `HospitalRegistrationPage`| `/register-hospital`    | Hospital registration with map location picker   |
| `DonorsPage`              | `/donors`               | All registered donors with eligibility badges    |
| `HospitalsPage`           | `/hospitals`            | All hospitals with call buttons and detail modal |
| `HistoryPage`             | `/history`              | Real-time donation activity feed                 |
| `EmergencyPage`           | `/emergency`            | SOS broadcast form with two-step confirmation    |
| `CertificatePage`         | `/certificate`          | Printable donation certificate with unique ID    |
| `SettingsPage`            | `/settings`             | Dark mode toggle, app info, logout               |
| `ProfileEditPage`         | `/profile/edit`         | Edit existing donor profile fields               |
| `AboutPage`               | `/about`                | Project description and team info                |
| `PrivacyPage`             | `/privacy`              | Privacy policy                                   |
| `ContactPage`             | `/contact`              | Contact information                              |

### Shared Components (`src/components/shared/`)

| Component              | Props                                        | Purpose                                  |
|------------------------|----------------------------------------------|------------------------------------------|
| `BloodBadge`           | `group: string`                              | Red blood group badge (e.g. "O+")        |
| `RaktButton`           | `onClick, disabled, children`                | Primary red action button                |
| `RaktOutlinedButton`   | `onClick, disabled, children`                | Outlined variant button                  |
| `CustomCard`           | `title, children`                            | Reusable card container                  |
| `DonorCard`            | `donor: Donor, isBestMatch, onClick`         | Donor list item with score and badge     |
| `SkeletonCard`         | (none)                                       | Shimmer loading placeholder              |
| `EligibilityBadge`     | `eligible: boolean`                          | "Eligible" / "Cooling Period" badge      |
| `SegmentedControl`     | `options, value, onChange`                   | Two-option tab toggle (e.g. Map/List)    |
| `UserDetailModal`      | `donor: Donor, onClose`                      | Full-screen donor detail sheet           |
| `HospitalDetailModal`  | `hospital: Hospital, onClose`                | Full-screen hospital info sheet          |
| `ErrorBoundary`        | `children`                                   | Catches render errors, shows fallback    |

### Map Components (`src/components/map/`)

| Component          | Props                                                           | Description                               |
|--------------------|-----------------------------------------------------------------|-------------------------------------------|
| `DonorMap`         | `center, radiusKm, donorMarkers[], onMarkerClick`               | Leaflet map with color-coded blood group markers |
| `LocationPicker`   | `lat, lng, onLocationChange`                                    | Draggable map pin for registration forms  |

### UI Primitives (`src/components/ui/`)

18 shadcn/ui primitives customized with **base-nova** style:

`badge` · `button` · `card` · `dialog` · `dropdown-menu` · `input` · `navigation-menu` · `select` · `separator` · `sheet` · `skeleton` · `slider` · `switch` · `tabs` · `textarea`

---

## Hooks API

### `useAuth()`

```ts
useAuth(): { user: User | null; loading: boolean }
signInWithGoogle(): Promise<User>
signOut(): Promise<void>
```

Subscribes to Firebase `onAuthStateChanged`. Exposes Google sign-in popup and sign-out functions.

### `useCurrentUser()`

```ts
useCurrentUser(): {
  currentUser: Donor | null;
  loading: boolean;
}
updateCurrentUser(uid: string, data: Partial<Donor>): Promise<void>
```

Real-time listener on `users/{uid}` doc. Returns `null` when no user is signed in or no profile exists.

### `useDonors()`

```ts
useDonors(): {
  donors: Donor[];
  loading: boolean;
  error: string | null;
}
addDonor(donor: Omit<Donor, "uid">): Promise<string>
updateDonor(uid: string, data: Partial<Donor>): Promise<void>
```

Real-time `onSnapshot` on `users` collection ordered by `name`. Returns all registered donors.

### `useHospitals()`

```ts
useHospitals(): {
  hospitals: Hospital[];
  loading: boolean;
  error: string | null;
}
addHospital(hospital: Omit<Hospital, "id">): Promise<string>
updateHospital(id: string, data: Partial<Hospital>): Promise<void>
```

Real-time `onSnapshot` on `hospitals` collection ordered by `name`.

### `useDonationLogs()`

```ts
useDonationLogs(): {
  logs: DonationLog[];
  loading: boolean;
  error: string | null;
}
addDonationLog(log: Omit<DonationLog, "id">): Promise<string>
```

Real-time `onSnapshot` on `donation_logs` ordered by `timestamp` descending.

### `useEmergencies()`

```ts
useEmergencies(): {
  emergencies: EmergencyRequest[];
  loading: boolean;
  error: string | null;
}
broadcastEmergency(data: Omit<EmergencyRequest, "id">): Promise<string>
resolveEmergency(id: string): Promise<void>
```

Real-time `onSnapshot` on `emergencies` filtered to `status == "ACTIVE"`.

---

## Utility Functions

All in `src/lib/utils.ts`:

| Function               | Signature                                              | Description                                |
|------------------------|--------------------------------------------------------|--------------------------------------------|
| `cn`                   | `(...inputs: ClassValue[]) => string`                  | Tailwind class merger (clsx + tailwind-merge) |
| `calculateDistance`    | `(lat1, lon1, lat2, lon2) => number`                   | Haversine formula; returns km (1 decimal) |
| `calculateSmartScore`  | `(dist, responseSpeed, activeDaysAgo, freq) => number` | Composite donor ranking score              |
| `isEligible`           | `(lastDonationMs: number) => boolean`                  | 90-day cooling period check                |
| `formatFullDate`       | `(timestamp: number) => string`                        | Locale-aware full date string              |
| `validatePhone`        | `(phone: string) => string \| null`                     | Phone regex validator                      |
| `validateEmail`        | `(email: string) => string \| null`                     | Email regex validator                      |
| `validateAge`          | `(age: number) => string \| null`                       | Age range (18–120) validator               |
| `validateName`         | `(name: string) => string \| null`                      | Min 2 chars name validator                 |
| `validateRequired`     | `(value, fieldName) => string \| null`                  | Generic required-field check               |

---

## Data Types

All defined in `src/types/index.ts`:

### Donor

| Field            | Type     | Description                        |
|------------------|----------|------------------------------------|
| `uid`            | `string` | Firebase Auth UID                  |
| `name`           | `string` | Full name                          |
| `email`          | `string` | Email address                      |
| `age`            | `number` | Age (18–120)                       |
| `gender`         | `string` | "Male" / "Female" / "Other"        |
| `group`          | `string` | Blood group (e.g. "O+")            |
| `phone`          | `string` | Primary phone                      |
| `altPhone`       | `string` | Alternate phone                    |
| `address`        | `string` | Residential address                |
| `lat`            | `number` | Latitude                           |
| `lng`            | `number` | Longitude                          |
| `lastDonationMs` | `number` | Last donation epoch (ms)           |
| `responseSpeed`  | `number` | Response speed rating              |
| `freq`           | `number` | Lifetime donation count            |
| `activeDaysAgo`  | `number` | Days since last activity           |
| `calcDist`       | `number` | *(computed)* Distance from searcher |
| `smartScore`     | `number` | *(computed)* Composite rank score   |
| `isEligible`     | `boolean`| *(computed)* 90-day eligibility     |

### Hospital

| Field      | Type     | Description             |
|------------|----------|-------------------------|
| `id`       | `string` | Auto-generated doc ID   |
| `name`     | `string` | Hospital name           |
| `address`  | `string` | Physical address        |
| `lat`      | `number` | Latitude                |
| `lng`      | `number` | Longitude               |
| `email`    | `string` | Contact email           |
| `phone`    | `string` | Mobile number           |
| `landline` | `string` | Landline number         |

### DonationLog

| Field          | Type     | Description                     |
|----------------|----------|---------------------------------|
| `id`           | `string` | Auto-generated doc ID           |
| `userId`       | `string` | Donor's Firebase UID            |
| `userName`     | `string` | Donor display name              |
| `bloodGroup`   | `string` | Donor blood group               |
| `hospitalName` | `string` | Hospital where donated          |
| `timestamp`    | `number` | Donation epoch (ms)             |

### EmergencyRequest

| Field          | Type     | Description                     |
|----------------|----------|---------------------------------|
| `id`           | `string` | Auto-generated doc ID           |
| `requesterId`  | `string` | Broadcaster's Firebase UID      |
| `bloodGroup`   | `string` | Required blood group            |
| `units`        | `number` | Number of units needed          |
| `lat`          | `number` | Requester latitude              |
| `lng`          | `number` | Requester longitude             |
| `status`       | `string` | "ACTIVE" or "RESOLVED"          |
| `timestamp`    | `number` | Broadcast epoch (ms)            |

---

## Firestore Schema & Security

### Collections

```
firestore-database/
├── users/{uid}/
│   ├── uid: string               # Firebase Auth UID
│   ├── name: string              # Full name
│   ├── email: string             # Email
│   ├── age: number               # Age
│   ├── gender: string            # Male / Female / Other
│   ├── group: string             # Blood group
│   ├── phone: string             # Primary phone
│   ├── altPhone: string          # Alternate phone
│   ├── address: string           # Address
│   ├── lat: number               # Latitude
│   ├── lng: number               # Longitude
│   ├── lastDonationMs: number    # Last donation timestamp (ms)
│   ├── responseSpeed: number     # Response speed rating
│   ├── freq: number              # Lifetime donation count
│   └── activeDaysAgo: number     # Days since last activity
│
├── hospitals/{id}/
│   ├── name: string              # Hospital name
│   ├── address: string           # Address
│   ├── lat: number               # Latitude
│   ├── lng: number               # Longitude
│   ├── email: string             # Contact email
│   ├── phone: string             # Mobile number
│   └── landline: string          # Landline number
│
├── donation_logs/{id}/
│   ├── userId: string            # Donor UID
│   ├── userName: string          # Donor display name
│   ├── bloodGroup: string        # Donor blood group
│   ├── hospitalName: string      # Hospital name
│   └── timestamp: number         # Donation timestamp (ms)
│
└── emergencies/{id}/
    ├── requesterId: string       # User UID who broadcasted
    ├── bloodGroup: string        # Required blood group
    ├── units: number             # Units needed
    ├── lat: number               # Requester latitude
    ├── lng: number               # Requester longitude
    ├── status: string            # "ACTIVE" or "RESOLVED"
    └── timestamp: number         # Broadcast timestamp (ms)
```

### Security Rules Summary

| Collection       | Read    | Create                               | Update/Delete                        |
|------------------|---------|--------------------------------------|--------------------------------------|
| `users`          | Public  | Owner only (`uid == auth.uid`)       | Owner only                           |
| `hospitals`      | Public  | Any authenticated user               | Creator only (`createdBy == uid`)    |
| `donation_logs`  | Public  | Authenticated + owns record          | Owner only                           |
| `emergencies`    | Public  | Authenticated + owns record          | Owner only                           |

Full rules in `firestore.rules` at repository root.

---

## Route Table

| Path                  | Page                    | Auth Req | Description                     |
|-----------------------|-------------------------|----------|---------------------------------|
| `/`                   | → redirect `/search`    | No       | Landing redirect                |
| `/search`             | `SearchPage`            | No       | Donor map & list discovery      |
| `/register`           | `UserRegistrationPage`  | No*      | Donor registration form         |
| `/register-hospital`  | `HospitalRegistrationPage` | No*   | Hospital registration form      |
| `/donors`             | `DonorsPage`            | No       | All donors grid                 |
| `/hospitals`          | `HospitalsPage`         | No       | All hospitals list              |
| `/history`            | `HistoryPage`           | No       | Donation activity feed          |
| `/emergency`          | `EmergencyPage`         | Yes      | SOS broadcast form              |
| `/certificate`        | `CertificatePage`       | No       | Printable donation certificate  |
| `/settings`           | `SettingsPage`          | No       | Theme toggle, app info          |
| `/profile/edit`       | `ProfileEditPage`       | Yes      | Edit donor profile              |
| `/about`              | `AboutPage`             | No       | Project info                    |
| `/privacy`            | `PrivacyPage`           | No       | Privacy policy                  |
| `/contact`            | `ContactPage`           | No       | Contact information             |

> *\* Auth is prompted on form submit (not page access).*

---

## State Management

The app does **not** use a global state library. State is managed through:

### 1. React Context (3 providers)

| Provider          | File (`src/providers/`)      | State                  |
|-------------------|------------------------------|------------------------|
| `ThemeProvider`   | `ThemeProvider.tsx`          | `theme` (light/dark)   |
| `ToastProvider`   | `ToastProvider.tsx`          | `toasts[]`             |
| `AuthProvider`    | `AuthProvider.tsx`           | `user`, `loading`      |

### 2. Custom Hooks with `useState` + `useEffect`

All 6 data hooks use `useState` for local state and `useEffect` for Firestore subscription lifecycle. The `onSnapshot` listener is cleaned up on unmount via the returned unsubscribe function.

### 3. Local Component State

SearchPage manages `selectedGroup`, `radius`, `userLocation`, `selectedDonor`, `showMap` locally. Registration forms manage individual field states.

---

## Theming

### Implementation

`ThemeProvider` reads/writes `localStorage` key `rakta-theme`. Toggles `.dark` class on `<html>` element. Tailwind CSS `@custom-variant dark` directive handles all dark-mode variants.

### CSS Variables

Two color palettes defined in `:root` (light) and `.dark` (dark) blocks in `src/index.css`:

- **Background:** `oklch(1 0 0)` light / `oklch(0.145 0 0)` dark
- **Primary:** `oklch(0.205 0 0)` light / `oklch(0.922 0 0)` dark
- **Destructive:** `oklch(0.577 0.245 27.325)` light / `oklch(0.704 0.191 22.216)` dark
- Custom `--color-rakta-red: #D32F2F`

### Custom `@theme` Tokens

```css
@theme {
  --color-rakta-red: #D32F2F;
  --color-rakta-red-light: #EF5350;
  --color-rakta-bg: #F4F6F8;
  --color-rakta-card-border: #EEEEEE;
}
```

### Typography

Geist Variable font via `@fontsource-variable/geist`. Applied globally on `<html>` as `font-sans`.

---

## Build & Deploy Configuration

### Vite (`vite.config.ts`)

```ts
base: isDev ? "/" : "/raktavahini-web/"  // GitHub Pages subpath
plugins: [react(), tailwindcss()]
resolve.alias: { "@": "./src" }
```

Dev server headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(self), camera=(), microphone=()`

### TypeScript

- `tsconfig.json` — strict mode, `@/` alias
- `tsconfig.app.json` — app-specific config
- `tsconfig.node.json` — Vite/Node config

### Content Security Policy (in `index.html`)

```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval'
style-src  'self' 'unsafe-inline'
img-src    'self' data: https://*.tile.openstreetmap.org
connect-src 'self' https://*.googleapis.com https://*.firebaseio.com
            https://*.firestore.googleapis.com https://identitytoolkit.googleapis.com
            https://securetoken.googleapis.com wss://*.firebaseio.com
font-src   'self' data: https://fonts.gstatic.com
frame-src  'self' https://*.firebaseapp.com
```

### CI/CD (GitHub Actions)

File: `.github/workflows/deploy.yml`

Trigger: push to `main` branch

Steps:
1. `npm ci`
2. `npm run build` (tsc + vite)
3. Upload `dist/` as Pages artifact
4. Deploy to GitHub Pages

Required repository secrets: all `VITE_FIREBASE_*` variables.

---

## Contributing

### Getting Started

1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/raktavahini-web.git
   cd raktavahini-web
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy environment template:
   ```bash
   cp .env.example .env
   ```
5. Fill in Firebase credentials in `.env`.
6. Start dev server:
   ```bash
   npm run dev
   ```

### Development Conventions

- **Component structure:** Keep pages in `src/pages/`, shared components in `src/components/shared/`, map components in `src/components/map/`.
- **Data access:** Always use the custom hooks (not direct Firestore calls in pages).
- **TypeScript:** Strict mode enforced. All props must be typed. Avoid `any`.
- **Styling:** Use Tailwind utility classes. Leverage `cn()` from `src/lib/utils.ts` for conditional classes. Use shadcn/ui primitives where possible.
- **Error handling:** Every data hook exposes an `error` state. Display errors via `useToast`.
- **Loading states:** All pages must handle `loading` states (use `SkeletonCard` for lists).
- **Theme support:** Check both light and dark modes before submitting.

### Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature
   ```
2. Commit with conventional commit messages:
   ```bash
   git commit -m "feat: add hospital search filter"
   ```
3. Push and open a pull request against `main`.
4. Ensure CI passes (GitHub Actions build check).

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior:**
- The use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Project maintainers are responsible for clarifying and enforcing standards. Violations can be reported by opening an issue or contacting the repository owner. All reports will be reviewed and investigated promptly and fairly.

---

## Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please **do not** open a public issue. Instead, contact the repository owner directly via GitHub.

### Current Security Measures

| Measure                     | Implementation                                       |
|-----------------------------|-------------------------------------------------------|
| CSP headers                 | `index.html` meta tag + Vite dev server headers      |
| Firestore rules             | Public read, owner-write (see `firestore.rules`)      |
| Authentication              | Firebase Auth with Google OAuth provider              |
| Input validation            | Client-side validators in `src/lib/utils.ts`          |
| Permissions policy          | Geolocation restricted to same-origin via Vite config |
| XSS protection              | `X-XSS-Protection: 1; mode=block`                    |
| Clickjacking prevention     | `X-Frame-Options: DENY`                               |

### Environment Security

- Firebase credentials are stored in `.env` (gitignored by `.gitignore`).
- GitHub Actions receives credentials via repository secrets.
- Never commit `.env` to version control.

---

## Changelog

### 1.0.0 (Initial Release)

- React 19 + TypeScript 5.7 + Vite 6
- Firebase v11 real-time Firestore with 4 collections
- Google Authentication with sign-in/sign-out
- Interactive Leaflet map with blood-group-coded markers
- Smart donor scoring algorithm (distance + speed + activity − frequency)
- 90-day eligibility algorithm
- Radius slider (1–100 km) and blood group filter
- Real-time donation history feed
- Emergency SOS broadcast with two-step confirmation
- Hospital and blood bank directory
- Dual registration (individual donor / hospital)
- Auto-generated printable certificate of heroism
- Dark mode with local storage persistence
- 18 shadcn/ui primitives with base-nova styling
- Geist Variable font from Vercel
- Toast notification system (success/error/info/warning)
- GitHub Actions CI/CD → GitHub Pages
- Strict CSP headers and Firestore security rules
- Mobile-first responsive design with bottom navigation

---

## FAQ

### How do I find a donor?

Go to the **Search** tab, fetch your live location (or allow browser geolocation), select your required blood group, and adjust the radius slider. Eligible donors are displayed sorted by smart score — the best match appears first.

### What does "Smart Score" mean?

Smart Score is a composite rank that balances proximity (distance), donor responsiveness, recent activity, and lifetime donation frequency. **Lower is better.** The top-ranked donor gets a "Best Match" badge.

### Who can register?

**Donors:** Any individual with a valid Google account who is 18+ years old. **Hospitals / Blood Banks:** Any institution can register with Google sign-in.

### How does the 90-day eligibility work?

The system checks if at least 90 days (≈3 months) have passed since the donor's last recorded donation. Donors who haven't donated in 90+ days are shown as "Eligible"; others display "Cooling Period."

### How do I broadcast an emergency?

Tap the red **phone** button (SOS FAB) at the bottom-right corner of any page. Fill in the required blood group and units. The system will automatically attach your GPS location. Confirm the two-step dialog to broadcast. Active emergencies are visible to all users in real time.

### Is my data safe?

Yes. All data is stored in Firebase Firestore with strict security rules. Only you can edit your own profile. Donor discovery data (name, blood group, location) is publicly readable to facilitate life-saving connections. Authentication is handled by Google OAuth.

### Can I use the app offline?

No. The app requires an active internet connection to communicate with Firebase Firestore and Authentication services.

### How do I get my donation certificate?

Log a donation via the history page or have a hospital verify it. Navigate to the **Certificate** tab to view and print your personalized certificate of heroism.

### What browsers are supported?

Any modern browser with ES module support: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+. Geolocation and IndexedDB are required for full functionality.

### How is the project related to the Android app?

[Rakta-Vahini Android](https://github.com/vijaykumarGK-Developer/rakthavahini) (Kotlin + Jetpack Compose) shares the same Firebase backend. The web app has additional features like the interactive Leaflet map, smart scoring visualization, and the printable certificate.

---

## Troubleshooting

### "Missing required environment variable: VITE_FIREBASE_*"

**Cause:** `.env` file is missing or incomplete.

**Fix:** Copy `.env.example` to `.env` and fill in your Firebase project credentials from the Firebase Console.

### "FirebaseError: Missing or insufficient permissions"

**Cause:** Firestore security rules are not deployed, or the user does not have permission.

**Fix:** Deploy the rules from `firestore.rules` using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

### White screen / blank page on production

**Cause:** Vite `base` path mismatch. The app is deployed under `/raktavahini-web/` subpath.

**Fix:** Ensure `vite.config.ts` has `base: isDev ? "/" : "/raktavahini-web/"`. Build with `npm run build`.

### Map tiles not loading

**Cause:** CSP `img-src` does not include OpenStreetMap tiles.

**Fix:** Verify `index.html` CSP meta tag includes `https://*.tile.openstreetmap.org` in `img-src`.

### Google Sign-In popup blocked

**Cause:** Browser popup blocker.

**Fix:** Allow popups from the site, or manually enable popups in your browser settings for this domain.

### "Geolocation is not supported by your browser"

**Cause:** The browser does not support the Geolocation API or it is disabled.

**Fix:** Use a modern browser (Chrome, Firefox, Edge). Ensure location access is allowed in site permissions.

### Donors not appearing in search

Check:
1. You have fetched your live location (blue button).
2. The selected blood group matches registered donors.
3. The radius slider is wide enough.
4. Donors are within the 90-day eligibility window.
5. There are registered donors in the Firebase `users` collection.

### Social sign-in works but profile doesn't save

**Cause:** The Firestore `users/{uid}` document does not exist. Registration form must be submitted to create the profile document.

**Fix:** Navigate to the **Profile** tab and fill out the registration form.
