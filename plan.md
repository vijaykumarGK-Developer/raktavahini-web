# Rakta-Vahini Web App — Development Plan

> Based on the Android app at [vijaykumarGK-Developer/rakthavahini](https://github.com/vijaykumarGK-Developer/rakthavahini)

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Framework | **React + Vite + TypeScript** |
| Routing | React Router v6 |
| State | React Context + `useReducer` |
| UI | Tailwind CSS + shadcn/ui |
| Maps | Leaflet (react-leaflet) |
| Backend | **Firebase** (same project as Android: `my-project-25072003`) |
| Auth | Firebase Auth (email + Google) |
| DB | Cloud Firestore (reuse existing collections) |
| Build | Vite |
| Deployment | Vercel / Netlify / Firebase Hosting |

---

## 2. Firestore Collections (Reused from Android)

| Collection | Document Fields |
|---|---|
| `users` | `uid, name, email, age, gender, group, phone, altPhone, address, lat, lng, lastDonationMs, responseSpeed, freq, activeDaysAgo` |
| `hospitals` | `id, name, address, lat, lng, email, phone, landline` |
| `donation_logs` | `id, userId, userName, timestamp, bloodGroup, hospitalName` |
| `emergencies` | `id, requesterId, bloodGroup, units, lat, lng, status, timestamp` |

---

## 3. Feature Mapping & Pages

| # | Android Feature | Web Page / Component |
|---|---|---|
| 1 | Splash Screen | `SplashPage` — animated logo, auto-redirect |
| 2 | Onboarding | `OnboardingPage` — welcome carousel (once per session) |
| 3 | **Donor Search** | `SearchPage` — blood group dropdown, radius slider, smart-scored list with Leaflet map |
| 4 | **Profile (Individual)** | `UserRegistrationPage` — form: name, age, gender, blood group, phone, address + location picker |
| 5 | **Hospital Registration** | `HospitalRegistrationPage` — form: name, address, email, phone, landline |
| 6 | Hospitals List | `HospitalsPage` — card list + detail modal with call/email links |
| 7 | Users / Donors List | `DonorsPage` — all registered donors with eligibility badge |
| 8 | Donation History | `HistoryPage` — filterable log of donations |
| 9 | **Emergency SOS** | `EmergencyPage` — form: blood group, units; broadcasts to Firestore |
| 10 | User Detail | `UserDetailModal` — info, eligibility, call link, donation count |
| 11 | Hospital Detail | `HospitalDetailModal` — address, contacts, map |
| 12 | Certificate | `CertificatePage` — "Certificate of Heroism" printable view |
| 13 | Settings | `SettingsPage` — dark mode toggle, edit profile, logout |
| 14 | Edit Profile | `ProfileEditPage` — inline form for user data |
| 15 | Static Pages | `AboutPage`, `PrivacyPage`, `ContactPage` |
| 16 | Site-wide | Dark/Light theme toggle, responsive navbar with bottom nav on mobile |

---

## 4. Screens / Routing Structure

```
/                 → Splash → Onboarding → Redirect to /search
/search           → Donor discovery (main tab)
/profile          → Register as individual or hospital
/hospitals        → Verified hospital directory
/donors           → All registered donors
/history          → Donation logs
/emergency        → SOS broadcast form
/settings         → Dark mode, edit profile, about, privacy, logout
/certificate      → Certificate view (after donation)
```

---

## 5. Component Tree (Key Parts)

```
App
├─ ThemeProvider (dark/light)
├─ AuthProvider (Firebase Auth state)
├─ FirestoreProvider (real-time listeners)
├─ Router
│  ├─ SplashPage
│  ├─ OnboardingPage
│  ├─ MainLayout (navbar + bottom tabs)
│  │  ├─ SearchPage
│  │  │  ├─ BloodGroupDropdown
│  │  │  ├─ RadiusSlider
│  │  │  ├─ LocationFetcher
│  │  │  ├─ DonorCard (smart score badge)
│  │  │  └─ LeafletMap
│  │  ├─ UserRegistrationPage
│  │  ├─ HospitalRegistrationPage
│  │  ├─ HospitalsPage → HospitalDetailModal
│  │  ├─ DonorsPage → UserDetailModal
│  │  ├─ HistoryPage
│  │  ├─ SettingsPage
│  │  └─ EmergencyPage
│  ├─ CertificatePage
│  ├─ AboutPage
│  ├─ PrivacyPage
│  └─ ContactPage
```

---

## 6. Utilities to Port

| Android Utility | Web Equivalent |
|---|---|
| `calculateDistance()` (Haversine) | Same pure function in TypeScript |
| Smart score: `dist + (speed×0.1) + (activeDays×0.5) - (freq×0.2)` | Same formula in TS |
| 90-day cooling period check | `Date.now() - lastDonationMs > 90*DAY_IN_MS` |
| `formatFullDate()` | `Intl.DateTimeFormat` |
| Real-time Firestore listeners | `onSnapshot()` from Firestore SDK |
| Dark/Light theme | Tailwind `darkMode: 'class'` + CSS variables |

---

## 7. Firebase Config

Use the same Firebase project as the Android app:

```js
const firebaseConfig = {
  apiKey: "AIzaSyAeE0yg9z1waVP03036mUy2DAxjOfILP1M",
  authDomain: "my-project-25072003.firebaseapp.com",
  projectId: "my-project-25072003",
  storageBucket: "my-project-25072003.firebasestorage.app",
  messagingSenderId: "1022514557574",
  appId: "1:1022514557574:web:..."
};
```

---

## 8. Implementation Phases

### Phase 1 — Foundation (Days 1–2)
- [ ] Scaffold Vite + React + TS + Tailwind + shadcn/ui
- [ ] Configure Firebase SDK, auth, Firestore
- [ ] Create theme provider (dark/light)
- [ ] Set up React Router and page scaffolding
- [ ] Create `MainLayout` with responsive navbar

### Phase 2 — Core Features (Days 3–5)
- [ ] **SearchPage** — blood group filter, radius slider, donor cards with smart scores
- [ ] **Leaflet map** showing donor locations
- [ ] **User/Hospital registration forms** with Firestore write
- [ ] **DonorsPage** / **HospitalsPage** with detail modals
- [ ] **HistoryPage** with real-time donation log list

### Phase 3 — Emergency & Recognition (Days 6–7)
- [ ] **EmergencyPage** — SOS form, Firestore broadcast
- [ ] **CertificatePage** — printable heroism certificate
- [ ] Real-time SOS listener (highlight active emergencies)

### Phase 4 — Polish (Days 8–9)
- [ ] **SettingsPage** — dark mode, edit profile, logout
- [ ] Static pages (About, Privacy, Contact)
- [ ] Loading skeletons and error states
- [ ] Responsive design pass (mobile-first)
- [ ] Location geolocation API integration

### Phase 5 — Launch Prep (Day 10)
- [ ] Performance audit
- [ ] Accessibility check
- [ ] Deploy to Vercel / Firebase Hosting
- [ ] Link web app from Android app (optional)

---

## 9. Key TypeScript Interfaces

```ts
interface Donor {
  uid: string; name: string; email: string;
  age: string; gender: string; group: string;
  phone: string; altPhone: string; address: string;
  lat: number; lng: number;
  lastDonationMs: number;
  responseSpeed: number; freq: number; activeDaysAgo: number;
  // UI-computed
  distance?: number; calcDist?: number;
  smartScore?: number; isEligible?: boolean;
}

interface Hospital {
  id: string; name: string; address: string;
  lat: number; lng: number;
  email: string; phone: string; landline: string;
}

interface EmergencyRequest {
  id: string; requesterId: string;
  bloodGroup: string; units: string;
  lat: number; lng: number;
  status: string; timestamp: number;
}
```

---

## 10. Git Workflow

```bash
git init
git add .
git commit -m "Initial scaffold — Rakta-Vahini web app"
```
