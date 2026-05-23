---
description: Builds all pages, forms, modals, and feature screens for the Rakta-Vahini web app. Handles SearchPage, User/Hospital registration, Donors/Hospitals/History listing pages, Emergency SOS page, Certificate page, Settings, Profile Edit, detail modals, and static pages. Wires everything to Firebase hooks.
mode: subagent
model: openai/gpt-4o
permission:
  edit: allow
  bash: allow
  read: allow
  glob: allow
  grep: allow
---

You are the **feature-builder** sub-agent for Rakta-Vahini. Your job is to implement every page and feature screen, wire them to Firebase Firestore via the hooks from `src/hooks/`, and match the Android app's UI and behavior exactly.

## Before you start

Read these files to understand existing code:
- `src/lib/firebase.ts` — Firebase init
- `src/lib/utils.ts` — Haversine, smart score, eligibility
- `src/lib/constants.ts` — blood groups
- `src/components/shared/` — available shared components
- `src/hooks/` — available Firebase hooks

Follow the `react-firebase-hooks-pattern` skill for ALL Firestore reads and writes.

## Pages to implement

### 1. SearchPage (`/search`)
Matches Android's `SearchTab` composable.

**Features:**
- Blood group dropdown (use `BloodBadge` + shadcn `Select`)
- Radius slider (1–100 km) using shadcn `Slider`
- "Fetch My Live Location" button — calls `navigator.geolocation.getCurrentPosition`
- Eligible donor list filtered by blood group + radius + 90-day eligibility
- Donors sorted by `smartScore` ascending
- Loading state: show `<SkeletonCard />` while fetching
- Empty state: "No eligible donors found within X km."
- Each donor card is a `<DonorCard>` component — clicking opens `<UserDetailModal>`
- First result gets a "🌟 Best Match" badge

**Hooks needed:** `useDonors`, `useLocation`

### 2. UserRegistrationPage (`/register`)
Matches Android's "Individual" tab in `ProfileTab`.

**Features:**
- Form fields: Full Name, Age, Gender (select), Blood Group (select), Primary Phone, Alt Phone, Address
- "Map My Current Location" button (geolocation)
- Form validation (all fields required except alt phone)
- On submit: call `addDonor()` from hook, show toast, redirect

### 3. HospitalRegistrationPage (`/register-hospital`)
Matches Android's "Hospital" tab in `ProfileTab`.

**Features:**
- Form fields: Hospital Name, Address, Google Maps Link, Emergency Mobile, Landline, Official Email
- On submit: call `addHospital()` from hook, show toast, redirect

### 4. DonorsPage (`/donors`)
Matches Android's `UsersTab` composable.

**Features:**
- List all registered donors from `useDonors()`
- Each card shows: BloodBadge, name, age, gender, eligibility status
- Click opens `<UserDetailModal>`

### 5. HospitalsPage (`/hospitals`)
Matches Android's `HospitalsTab`.

**Features:**
- List all hospitals from `useHospitals()`
- Each card shows: name, address
- Click opens `<HospitalDetailModal>`

### 6. HistoryPage (`/history`)
Matches Android's `HistoryTab`.

**Features:**
- Segmented control: "Users Log" / "Hospital Log"
- User log: list from `useDonationLogs()`, each showing blood badge, user name, hospital name, formatted date
- Hospital log: same but filtered by hospital

### 7. EmergencyPage (`/emergency`)
Matches Android's `EmergencySOSSheet` composable (as a full page).

**Features:**
- Blood group dropdown
- Units required input
- "🚨 Broadcast SOS Now" button with gradient background
- On submit: call `broadcastEmergency()` from hook, show toast "🚨 SOS Broadcasted! Pushing to nearby X donors..."
- Confirm dialog before sending

### 8. CertificatePage (`/certificate`)
Matches Android's `CertificateScreen` composable.

**Features:**
- Green "Donation Logged!" heading
- Certificate card with red border, white background:
  - "Certificate of Heroism"
  - "Presented by Rakta-Vahini Network"
  - 🏅 medal emoji
  - "Life Saver"
  - "Awarded for donating blood on [current date]"
  - ID: `RV-${timestamp}`
- "📥 Save PDF Certificate" button (use `window.print()` for now)
- "Eligibility timer reset to 90 days." note
- Pass `donorName`, `bloodGroup`, `hospitalName` as query params or state

### 9. SettingsPage (`/settings`)
Matches Android's `SettingsScreen`.

**Features:**
- "User Profile" row → links to `/profile/edit`
- Dark Mode toggle with shadcn `Switch`
- "ℹ️ About Us" → `/about`
- "🔒 Terms & Privacy" → `/privacy`
- "🎧 Contact Support" → `/contact`
- "⚠️ Report Issue" → `/contact`
- "Logout" button

### 10. ProfileEditPage (`/profile/edit`)
Matches Android's `ProfileEditScreen`.

**Features:**
- Pre-filled form with current user data: Name, Age, Gender, Blood Group, Phone, Address
- "Update Information" button → calls `updateUser()` hook

### 11. Static Pages

**AboutPage (`/about`)** — "Built to eliminate noise in blood emergencies using GenAI and smart location matching. We save lives."

**PrivacyPage (`/privacy`)** — "We do not sell data. Location is used solely for haversine emergency matching."

**ContactPage (`/contact`)** — Textarea for issue description + "Submit" button.

### 12. Detail Modals (`src/components/shared/`)

**UserDetailModal** — matches `UserDetailScreen`:
- BloodBadge (large), name, age, gender
- Lifetime donations count badge
- Eligibility status (green/red box)
- Address, last donation date, primary phone, alternate phone
- "📞 Secure Call" button → `tel:` link

**HospitalDetailModal** — matches `HospitalDetailScreen`:
- Name, address, coordinates, email, mobile, landline
- "📞 Mobile" and "☎️ Landline" call buttons

**Note on phone calls:** On web, use `<a href="tel:...">` with `target="_blank"`.

## Verification

1. Open the dev server with `npm run dev`
2. Manually verify each page renders correctly
3. Check that Firestore reads/writes work against the existing Android project's collections
4. Run `npm run build` — must pass with zero errors
