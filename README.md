<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Firebase-11-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet" alt="Leaflet">
  <img src="https://img.shields.io/github/license/vijaykumarGK-Developer/raktavahini-web?style=for-the-badge" alt="License">
</p>

<h1 align="center">🩸 Rakta-Vahini — Web Application</h1>
<h3 align="center">Modern Blood Donation Network Built with React, TypeScript, Firebase & Leaflet</h3>

<p align="center">
  A full-featured, real-time web application for connecting blood donors with hospitals and emergency requests.<br>
  Features an interactive Leaflet map, intelligent donor scoring, Google Authentication, and one-click SOS broadcasting.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-routes">Routes</a> •
  <a href="#-firestore-schema">Firestore Schema</a> •
  <a href="#-ci--cd">CI/CD</a>
</p>

---

## ✨ Features

### 🔍 Intelligent Donor Discovery
- **Interactive Map View** — Browse nearby donors on a Leaflet map with color-coded blood group markers (A+, B+, AB+, O+).
- **List View** — Toggle between map and card list layout for rapid scanning.
- **Smart Scoring** — Donors ranked by a composite algorithm: `distance + (responseSpeed × 0.1) + (activeDaysAgo × 0.5) - (freq × 0.2)`.
- **Best Match Badge** — Top-ranked donor highlighted with "Best Match" indicator.
- **Radius Slider** — Adjustable search range from 1 km to 100 km.
- **Blood Group Filter** — Dropdown selector for all 8 major blood groups (O±, A±, B±, AB±).
- **Live GPS Integration** — One-tap geolocation for accurate distance calculation using the Haversine formula.
- **Skeleton Loading** — Shimmer placeholders during search.

### 🚨 Emergency SOS System
- **One-Tap Broadcast** — SOS button in the bottom navigation bar opens the emergency page.
- **Blood Group & Units** — Specify the required blood group and number of units.
- **Location Sharing** — Automatically attaches current GPS coordinates.
- **Real-Time Propagation** — Emergency requests sync instantly via Firestore `onSnapshot` listeners.
- **Two-Step Confirmation** — Prevents accidental broadcasts with an "Are you sure?" dialog.

### 🏥 Hospital & Blood Bank Network
- **Verified Directory** — Browse all registered hospitals with address, coordinates, email, and contact numbers.
- **One-Tap Call** — Click-to-dial for both mobile and landline numbers.
- **Location Picker** — Hospitals register their location via an interactive map pin.

### 🏆 Heroism & Recognition
- **Certificate of Heroism** — Auto-generated printable certificate after every logged donation.
- **Certificate Details** — Donor name, blood group, date, hospital name, lifetime donation count, and unique certificate ID.
- **Donation History** — Real-time, scrollable feed of all donation activity across the network.

### 🔐 Authentication & Security
- **Google Sign-In** — One-click authentication via Firebase Auth with Google provider.
- **Firestore Security Rules** — Public read access for discovery features; owner-only write access.
- **Content Security Policy** — Strict CSP headers blocking XSS, clickjacking, and data injection.

### 🌓 Modern UI/UX
- **Dark Mode** — Full dark theme with toggle persisted in state.
- **Responsive Design** — Mobile-first layout optimized for all screen sizes.
- **Bottom Navigation** — 5-tab navigator (Search, Profile, Hospitals, Donors, Log).
- **shadcn/ui Components** — 17 accessible, unstyled primitives with base-nova styling.
- **Geist Variable Font** — Clean, modern typography from Vercel.
- **Toast Notifications** — Non-intrusive feedback for all actions.
- **Animated Transitions** — Smooth page transitions and modal animations.

### 👤 Dual Registration
- **Individual Donor Registration** — Name, age, gender, blood group, phone, address, and map-based location picker.
- **Hospital Registration** — Institution name, address, coordinates, email, and contact numbers.

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.7 | Type safety |
| [Vite](https://vitejs.dev/) | 6 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | base-nova | Accessible UI primitives |
| [React Router](https://reactrouter.com/) | 7 | Client-side routing |
| [Leaflet](https://leafletjs.com/) / [react-leaflet](https://react-leaflet.js.org/) | 1.9 / 5.0 | Interactive maps |
| [Lucide React](https://lucide.dev/) | 1.16 | Icons |
| [Geist Font](https://vercel.com/font) | 2.5 | Typography |

### Backend & Infrastructure
| Technology | Version | Purpose |
|---|---|---|
| [Firebase Firestore](https://firebase.google.com/docs/firestore) | 11 | Real-time NoSQL database |
| [Firebase Authentication](https://firebase.google.com/docs/auth) | 11 | Google sign-in |
| [GitHub Actions](https://github.com/features/actions) | — | CI/CD to GitHub Pages |

---

## 🏗 Architecture

### Application Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        BROWSER (React SPA)                        │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  PROVIDERS                                                  │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │  │
│  │  │   Theme     │  │    Auth     │  │   Toast             │ │  │
│  │  │  Provider   │  │   Provider  │  │   Provider          │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  ROUTER (React Router v7)                                  │  │
│  │                                                             │  │
│  │  Layout (Top Bar + Bottom Nav + SOS FAB)                    │  │
│  │    ├── /search          → SearchPage                        │  │
│  │    ├── /register        → UserRegistrationPage              │  │
│  │    ├── /donors          → DonorsPage                        │  │
│  │    ├── /hospitals       → HospitalsPage                     │  │
│  │    ├── /history         → HistoryPage                       │  │
│  │    ├── /emergency       → EmergencyPage                     │  │
│  │    ├── /certificate     → CertificatePage                   │  │
│  │    ├── /settings        → SettingsPage                      │  │
│  │    ├── /profile/edit    → ProfileEditPage                   │  │
│  │    ├── /about           → AboutPage                         │  │
│  │    ├── /privacy         → PrivacyPage                       │  │
│  │    └── /contact         → ContactPage                       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  HOOKS (Firebase Real-Time)                                │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐ │  │
│  │  │useAuth   │ │useDonors │ │useHosp-  │ │useDonationLogs │ │  │
│  │  │          │ │          │ │pitals    │ │                │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────────┘ │  │
│  │  ┌──────────┐ ┌──────────────┐                              │  │
│  │  │useEmerg- │ │useCurrentUser│                              │  │
│  │  │encies    │ │              │                              │  │
│  │  └──────────┘ └──────────────┘                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  FIREBASE (v11)                                            │  │
│  │  ┌──────────────────┐  ┌────────────────────┐              │  │
│  │  │  Cloud Firestore │  │  Authentication    │              │  │
│  │  │  (Real-time DB)  │  │  (Google Provider) │              │  │
│  │  └──────────────────┘  └────────────────────┘              │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action (search, register, SOS, donate)
        │
        ▼
React Component (Page)
        │
        ▼
Custom Hook (useDonors, useEmergencies, etc.)
        │
        ├─ Firestore onSnapshot ──> Real-time listener (read)
        └─ Firestore setDoc/addDoc ──> Write operation
                │
                ▼
        Firestore triggers snapshot callback
                │
                ▼
        React re-renders with new data
```

### Smart Scoring Formula

```typescript
smartScore = calcDist + (responseSpeed * 0.1) + (activeDaysAgo * 0.5) - (freq * 0.2)
```

| Component | Weight | Description |
|---|---|---|
| `calcDist` | ×1.0 | Distance from searcher (km) |
| `responseSpeed` | ×0.1 | Historical response time rating |
| `activeDaysAgo` | ×0.5 | Days since last activity |
| `freq` | ×−0.2 | Lifetime donation count (bonus) |

### Eligibility Algorithm

```typescript
const daysSince = Date.now() - donor.lastDonationMs;
const isEligible = daysSince > 90 * 24 * 60 * 60 * 1000; // 90-day cooling period
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Firebase Project | With Auth (Google) & Firestore enabled |

### Step 1: Clone

```bash
git clone https://github.com/vijaykumarGK-Developer/raktavahini-web.git
cd raktavahini-web
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Firebase

```bash
cp .env.example .env
```

Edit `.env` with your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-project
VITE_FIREBASE_STORAGE_BUCKET=my-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 4: Enable Firebase Services

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. **Authentication** → Sign-in method → Enable **Google** provider.
3. **Firestore Database** → Create database → Start in test mode (restrict before production).
4. Copy the **Firestore security rules** from `firestore.rules` in this repo.

### Step 5: Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Step 6: Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
raktavahini-web/
├── .env.example                          # Firebase env template
├── .github/workflows/deploy.yml          # GitHub Actions → GitHub Pages
├── components.json                       # shadcn/ui configuration
├── firestore.rules                       # Firestore security rules
├── index.html                            # Entry HTML with CSP headers
├── package.json                          # Dependencies & scripts
├── vite.config.ts                        # Vite + Tailwind + aliases
├── tsconfig*.json                        # TypeScript configuration
├── plan.md / execution.md / human-steps.md   # Development documentation
│
├── public/
│   └── vite.svg
│
└── src/
    ├── main.tsx                          # React entry point
    ├── App.tsx                           # Router + providers
    ├── index.css                         # Tailwind + theme variables
    │
    ├── lib/
    │   ├── firebase.ts                   # Firebase initialization
    │   ├── utils.ts                      # Haversine, scoring, validation
    │   └── constants.ts                  # Blood groups, app constants
    │
    ├── types/
    │   └── index.ts                      # Donor, Hospital, DonationLog, EmergencyRequest
    │
    ├── hooks/
    │   ├── useAuth.ts                    # Auth state + Google sign-in
    │   ├── useCurrentUser.ts             # Current user document
    │   ├── useDonors.ts                  # Donors collection (real-time)
    │   ├── useHospitals.ts               # Hospitals collection (real-time)
    │   ├── useDonationLogs.ts            # Donation logs collection (real-time)
    │   └── useEmergencies.ts             # Emergencies collection (real-time)
    │
    ├── providers/
    │   ├── AuthProvider.tsx              # Auth context
    │   ├── ThemeProvider.tsx             # Dark/light theme
    │   └── ToastProvider.tsx             # Toast notifications
    │
    ├── components/
    │   ├── map/
    │   │   ├── DonorMap.tsx              # Leaflet map with blood group markers
    │   │   └── LocationPicker.tsx        # Draggable pin for registration forms
    │   │
    │   ├── shared/
    │   │   ├── BloodBadge.tsx            # Red blood group badge
    │   │   ├── RaktButton.tsx            # Primary action button
    │   │   ├── RaktOutlinedButton.tsx    # Outlined button
    │   │   ├── CustomCard.tsx            # Reusable card container
    │   │   ├── DonorCard.tsx             # Donor list item
    │   │   ├── SkeletonCard.tsx          # Loading placeholder
    │   │   ├── EligibilityBadge.tsx      # Eligible/Cooling badge
    │   │   ├── SegmentedControl.tsx      # Tab toggle
    │   │   ├── UserDetailModal.tsx       # Full-screen donor profile
    │   │   ├── HospitalDetailModal.tsx   # Full-screen hospital info
    │   │   └── ErrorBoundary.tsx         # Error boundary
    │   │
    │   └── ui/                           # 17 shadcn/ui primitives
    │       ├── badge.tsx, button.tsx, card.tsx, dialog.tsx,
    │       ├── dropdown-menu.tsx, input.tsx, navigation-menu.tsx,
    │       ├── select.tsx, separator.tsx, sheet.tsx, skeleton.tsx,
    │       ├── slider.tsx, switch.tsx, tabs.tsx, textarea.tsx
    │
    └── pages/
        ├── Layout.tsx                    # Header, bottom nav, SOS FAB
        ├── SearchPage.tsx                # Donor search (core page)
        ├── UserRegistrationPage.tsx      # Donor registration form
        ├── HospitalRegistrationPage.tsx  # Hospital registration
        ├── DonorsPage.tsx               # All donors list
        ├── HospitalsPage.tsx            # All hospitals list
        ├── HistoryPage.tsx              # Donation activity feed
        ├── EmergencyPage.tsx            # SOS broadcast
        ├── CertificatePage.tsx          # Printable certificate
        ├── SettingsPage.tsx             # Dark mode, app info
        ├── ProfileEditPage.tsx          # Edit donor profile
        ├── AboutPage.tsx                # About the app
        ├── PrivacyPage.tsx              # Privacy policy
        └── ContactPage.tsx              # Contact information
```

---

## 🗺 Routes

| Path | Page | Description | Auth Required |
|---|---|---|---|
| `/` | Redirect → `/search` | Landing page | No |
| `/search` | `SearchPage` | Donor discovery with map & list view | No |
| `/register` | `UserRegistrationPage` | Donor registration form | Yes (to save) |
| `/register-hospital` | `HospitalRegistrationPage` | Hospital registration | Yes (to save) |
| `/donors` | `DonorsPage` | All registered donors | No |
| `/hospitals` | `HospitalsPage` | All verified hospitals | No |
| `/history` | `HistoryPage` | Donation activity feed | No |
| `/emergency` | `EmergencyPage` | SOS broadcast form | Yes |
| `/certificate` | `CertificatePage` | Donation certificate | No |
| `/settings` | `SettingsPage` | Dark mode, app info | No |
| `/profile/edit` | `ProfileEditPage` | Edit donor profile | Yes |
| `/about` | `AboutPage` | About the project | No |
| `/privacy` | `PrivacyPage` | Privacy policy | No |
| `/contact` | `ContactPage` | Contact information | No |

---

## 🔥 Firestore Schema

### Collections

```
firestore-database/
├── users/{uid}/
│   ├── uid: string               # Firebase Auth UID
│   ├── name: string              # Full name
│   ├── email: string             # Email
│   ├── age: number               # Age
│   ├── gender: string            # Male / Female / Other
│   ├── group: string             # Blood group (e.g., "O+")
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
│   ├── id: string                # Auto-generated document ID
│   ├── name: string              # Hospital name
│   ├── address: string           # Address
│   ├── lat: number               # Latitude
│   ├── lng: number               # Longitude
│   ├── email: string             # Contact email
│   ├── phone: string             # Mobile number
│   └── landline: string          # Landline number
│
├── donation_logs/{id}/
│   ├── id: string                # Auto-generated document ID
│   ├── userId: string            # Donor UID
│   ├── userName: string          # Donor display name
│   ├── timestamp: number         # Donation timestamp (ms)
│   ├── bloodGroup: string        # Donor blood group
│   └── hospitalName: string      # Hospital name
│
└── emergencies/{id}/
    ├── id: string                # Auto-generated document ID
    ├── requesterId: string       # User UID who broadcasted
    ├── bloodGroup: string        # Required blood group
    ├── units: number             # Units needed
    ├── lat: number               # Requester latitude
    ├── lng: number               # Requester longitude
    ├── status: string            # "ACTIVE" or "RESOLVED"
    └── timestamp: number         # Broadcast timestamp (ms)
```

### Security Rules

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Public read, owner-only write
    match /users/{userId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null
        && request.auth.uid == userId;
    }

    // Public read, authenticated create
    match /hospitals/{hospitalId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && resource.data.createdBy == request.auth.uid;
    }

    // Public read, authenticated owner create
    match /donation_logs/{logId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }

    // Public read, authenticated owner create
    match /emergencies/{emergencyId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.requesterId == request.auth.uid;
    }
  }
}
```

---

## 🔄 CI / CD

The project includes a **GitHub Actions** workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to **GitHub Pages** whenever changes are pushed to the `main` branch.

### Workflow

```
Push to main branch
        │
        ▼
GitHub Actions triggers deploy.yml
        │
        ▼
npm ci (clean install)
        │
        ▼
npm run build (TypeScript check + Vite build)
        │
        ▼
Upload dist/ as GitHub Pages artifact
        │
        ▼
Deploy to GitHub Pages
        │
        ▼
Site live at: https://vijaykumargk-developer.github.io/raktavahini-web/
```

### Required Secrets

For the CI/CD pipeline to work, the following secrets must be set in the GitHub repository:

| Secret | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server (hot reload) |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview production build locally |

---

## 🤝 Contributing

### How to Contribute

1. **Fork** the repository.
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** following the existing patterns.
4. **Commit:**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push:**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request.**

### Guidelines

- Follow the existing component structure (presentational vs. container).
- Use the custom hooks for all Firebase operations.
- Ensure TypeScript strict mode compliance.
- Add proper error handling and loading states.
- Test on both light and dark themes.
- Use shadcn/ui primitives where possible.

---

## 📄 License

This project is for educational and community use.

---

## 📬 Related Projects

| Project | Description | Stack |
|---|---|---|
| [rakthavahini](https://github.com/vijaykumarGK-Developer/rakthavahini) | Android app | Kotlin + Jetpack Compose + Firebase |
| [rakthavahini-html](https://github.com/vijaykumarGK-Developer/rakthavahini-html) | Vanilla HTML/JS version | HTML + CSS + JavaScript |
| [rakthavahini-web](https://github.com/vijaykumarGK-Developer/raktavahini-web) | Modern web app *(this repo)* | React + TypeScript + Firebase |

---

<p align="center">
  <b>Rakta-Vahini</b> — <i>Connecting Hearts, Saving Lives.</i>
  <br><br>
  <a href="https://github.com/vijaykumarGK-Developer/raktavahini-web">GitHub</a> •
  <a href="https://github.com/vijaykumarGK-Developer/raktavahini-web/issues">Issues</a>
  <br><br>
  <sub>Built with React 19, TypeScript, Firebase, Tailwind CSS 4, shadcn/ui, and Leaflet</sub>
</p>
