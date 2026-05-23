# Rakta-Vahini — Human Execution Steps

> **Your role:** You run ALL terminal commands. The model ONLY writes code files.
> **Important:** Steps marked with 🖥️ must be run in your **own terminal** (PowerShell), not through opencode.

---

## BEFORE YOU START

- [ ] Open **PowerShell** (not CMD, not Git Bash)
- [ ] Navigate to the project folder:
```powershell
cd "E:\raktavahini web app"
```

---

## PHASE 1 — Project Skeleton

### STEP 1.1 🖥️ Scaffold Vite project (Run in YOUR terminal)

```powershell
# Delete existing non-essential files first (keeps plan.md, execution.md, .opencode/)
Remove-Item -Recurse -Force src\ -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force public\ -ErrorAction SilentlyContinue
Remove-Item -Force tsconfig*.json package.json vite.config.ts index.html -ErrorAction SilentlyContinue

# Scaffold fresh
npm create vite@latest . -- --template react-ts
# → When it asks "Are you sure?" type: y
```

Then install:
```powershell
npm install
```

**Verify:** You should see `node_modules/` folder and `src/` folder with `main.tsx` and `App.tsx`.

---

### STEP 1.2 🖥️ Install dependencies (Run in YOUR terminal)

```powershell
npm install react-router-dom firebase
npm install -D tailwindcss @tailwindcss/vite
```

---

### STEP 1.3 🖥️ Install shadcn/ui (Run in YOUR terminal)

```powershell
npx shadcn@latest init -d --force
```

```powershell
npx shadcn@latest add button card input select switch slider sheet dialog toast dropdown-menu navigation-menu tabs textarea badge separator skeleton
```

---

### STEP 1.4 — Tell opencode model to write skeleton files

Copy-paste this EXACT message to the model:

```
We are in Phase 1, Step 1.4 of the Rakta-Vahini web app.
The Vite project is scaffolded, dependencies installed, shadcn/ui configured.

Now write ALL these files. Read human-steps.md first for context.

1. src/lib/firebase.ts — Firebase init with this config:
   apiKey: "AIzaSyAeE0yg9z1waVP03036mUy2DAxjOfILP1M"
   authDomain: "my-project-25072003.firebaseapp.com"
   projectId: "my-project-25072003"
   storageBucket: "my-project-25072003.firebasestorage.app"
   messagingSenderId: "1022514557574"
   appId: "1:1022514557574:web:8520feee24f43536295707"

2. src/lib/utils.ts — Haversine calculateDistance(), calculateSmartScore(), isEligible(), formatFullDate()

3. src/lib/constants.ts — bloodGroups array, DAY_IN_MS

4. src/types/index.ts — Donor, Hospital, DonationLog, EmergencyRequest interfaces

5. src/index.css — @import "tailwindcss"; with brand colors: rakta-red (#D32F2F)

6. src/App.tsx — React Router with all routes pointing to placeholder pages

7. src/pages/Layout.tsx — Responsive layout with top navbar, bottom tabs (Search, Profile, Hospitals, Donors, History), SOS FAB button, <Outlet />

8. src/components/shared/BloodBadge.tsx — Red rounded box showing blood group

9. src/components/shared/RaktButton.tsx — Red full-width button

10. src/components/shared/RaktOutlinedButton.tsx — Outlined red button

11. src/components/shared/CustomCard.tsx — Card with border, shadow, optional onClick

12. src/components/shared/SegmentedControl.tsx — Two-option pill toggle

13. src/components/shared/DonorCard.tsx — Card with blood badge, name, distance, "Best Match" badge

14. src/components/shared/SkeletonCard.tsx — Shimmer loading placeholder

15. src/components/shared/EligibilityBadge.tsx — "✅ Eligible" or "🚫 Cooling Period"

16. ALL 13 placeholder pages in src/pages/ (each just exports a named component with an <h1>):
    - SearchPage.tsx, UserRegistrationPage.tsx, HospitalRegistrationPage.tsx
    - DonorsPage.tsx, HospitalsPage.tsx, HistoryPage.tsx
    - EmergencyPage.tsx, CertificatePage.tsx
    - SettingsPage.tsx, ProfileEditPage.tsx
    - AboutPage.tsx, PrivacyPage.tsx, ContactPage.tsx

17. src/providers/ThemeProvider.tsx — Dark mode with localStorage + class on <html>

Write all files now. Do NOT skip placeholder pages.
```

- [ ] **Wait for model to write ALL files**
- [ ] If model stops mid-way, say: "Continue writing the remaining files. You stopped after [file X]."

---

### STEP 1.5 🖥️ Verify build (Run in YOUR terminal)

```powershell
npm run build
```

- [ ] **Build passes?** → Move to Phase 2
- [ ] **Build fails?** → Copy the FULL error output, paste to model, say: `Build error. Fix it.` → repeat until green

---

## PHASE 2 — Data Layer

### STEP 2.1 — Tell model to write Firebase hooks

Copy-paste to model:

```
Phase 2. Build passes. Now write all Firebase hooks and providers.

Follow the react-firebase-hooks-pattern skill exactly.

Write these files:
1. src/hooks/useDonors.ts — useDonors() + addDonor() + updateDonor()
2. src/hooks/useHospitals.ts — useHospitals() + addHospital() + updateHospital()
3. src/hooks/useDonationLogs.ts — useDonationLogs() + addDonationLog()
4. src/hooks/useEmergencies.ts — useEmergencies() + broadcastEmergency() + resolveEmergency()
5. src/hooks/useAuth.ts — useAuth() + signInWithGoogle() + signOut()
6. src/hooks/useCurrentUser.ts — useCurrentUser() + updateCurrentUser()
7. src/providers/AuthProvider.tsx — wraps onAuthStateChanged

Each hook must return { data, loading, error }. Write functions exported separately.
Types come from src/types/index.ts. Firestore db comes from src/lib/firebase.ts.
```

- [ ] Wait for model to finish

### STEP 2.2 🖥️ Build check

```powershell
npm run build
```

- [ ] Build passes? → Continue
- [ ] Build fails? → Paste error to model, fix, repeat

### STEP 2.3 🖥️ Visual check

```powershell
npm run dev
```

- [ ] Open browser to `http://localhost:5173`
- [ ] Open DevTools → Console tab
- [ ] Check for Firebase errors (CORS, auth, etc.)
- [ ] If errors → paste to model
- [ ] Press `Ctrl+C` in terminal to stop dev server

---

## PHASE 3 — Core Features

> Build ONE page per step. Do NOT batch.

### STEP 3.1 — SearchPage

Tell model:

```
Phase 3. Build passes, Firestore connects. Write SearchPage.tsx.

Read these files first: src/types/index.ts, src/lib/utils.ts, src/hooks/useDonors.ts, src/components/shared/DonorCard.tsx, src/components/shared/SkeletonCard.tsx

Features:
- Blood group dropdown (use shadcn Select)
- Radius slider (1-100km, use shadcn Slider)
- "Fetch My Live Location" button calling navigator.geolocation
- Donor list filtered by: blood group match AND distance <= radius AND eligible (90-day rule)
- Donors sorted by smartScore ascending
- Loading skeleton while fetching
- Empty state: "No eligible donors found within X km."
- First result gets "🌟 Best Match" badge
```

- [ ] Wait for model to finish
- [ ] 🖥️ `npm run build` → fix errors → repeat
- [ ] 🖥️ `npm run dev` → go to `/search` → test dropdown, slider, location
- [ ] Report issues to model, fix until working

### STEP 3.2 — UserRegistrationPage

Tell model:

```
Write UserRegistrationPage.tsx. Form fields: Full Name, Age, Gender (select), Blood Group (select), Primary Phone, Alt Phone, Address. On submit call addDonor() from useDonors hook. Validate all required fields except alt phone. Show toast on success, redirect to /donors.
```

- [ ] Build → fix → 🖥️ `npm run dev` → fill form → submit
- [ ] Check Firebase Console → `users` collection for new doc
- [ ] No doc? → Tell model "Firestore write failed, check addDonor function"

### STEP 3.3 — HospitalRegistrationPage

Tell model:

```
Write HospitalRegistrationPage.tsx. Form: Hospital Name, Address, Emergency Mobile, Landline, Official Email. On submit call addHospital(). Show toast, redirect to /hospitals.
```

- [ ] Build → fix → verify in Firebase Console

### STEP 3.4 — DonorsPage + UserDetailModal

Tell model:

```
Write DonorsPage.tsx and a UserDetailModal component in src/components/shared/. DonorsPage lists all donors from useDonors(), shows BloodBadge, name, age, gender, eligibility. Click opens UserDetailModal showing full donor info and a tel: call button.
```

- [ ] Build → fix → verify visually

### STEP 3.5 — HospitalsPage + HospitalDetailModal

Tell model:

```
Write HospitalsPage.tsx and HospitalDetailModal. HospitalsPage lists all hospitals from useHospitals(). Click opens modal showing full info with mobile and landline call buttons.
```

- [ ] Build → fix → verify

### STEP 3.6 — HistoryPage

Tell model:

```
Write HistoryPage.tsx. Segmented control "Users Log" / "Hospital Log". Lists donation logs from useDonationLogs() with blood badge, user name, hospital name, formatted date.
```

- [ ] Build → fix → verify

### STEP 3.7 — Full test

- [ ] 🖥️ `npm run dev`
- [ ] Register a donor → see in /donors → see in /search
- [ ] Tell model: "Add a 'Log Donation' button on UserDetailModal that calls addDonationLog()"
- [ ] Test log donation → see in /history
- [ ] All flows work? → **Phase 3 done**

---

## PHASE 4 — Advanced Features

### STEP 4.1 — EmergencyPage

Tell model:

```
Write EmergencyPage.tsx. Blood group dropdown, units input, "🚨 Broadcast SOS Now" gradient button. On submit call broadcastEmergency() from useEmergencies hook. Show confirm dialog before sending.
```

- [ ] Build → fix → 🖥️ test → check Firebase `emergencies` collection

### STEP 4.2 — CertificatePage

Tell model:

```
Write CertificatePage.tsx. "Certificate of Heroism" in red-bordered white card: medal emoji, "Life Saver", current date, ID RV-{timestamp}. "📥 Save PDF Certificate" button using window.print().
```

- [ ] Build → fix → verify visually

### STEP 4.3 — SettingsPage

Tell model:

```
Write SettingsPage.tsx. Rows for: User Profile (links to /profile/edit), Dark Mode toggle, About Us (/about), Privacy (/privacy), Contact Support (/contact), Report Issue (/contact), Logout button.
```

- [ ] Build → fix → verify

### STEP 4.4 — ProfileEditPage

Tell model:

```
Write ProfileEditPage.tsx. Pre-filled form from useCurrentUser(): Name, Age, Gender, Blood Group, Phone, Address. Save calls updateCurrentUser(). Show toast.
```

- [ ] Build → fix → verify

### STEP 4.5 — Static pages

Tell model:

```
Write AboutPage.tsx, PrivacyPage.tsx, ContactPage.tsx.
About: "Built to eliminate noise in blood emergencies using smart location matching."
Privacy: "We do not sell data. Location used solely for haversine emergency matching."
Contact: Textarea + Submit button.
```

- [ ] Build → fix → verify

### STEP 4.6 🖥️ Full walkthrough

- [ ] `npm run dev`
- [ ] Visit all 12 pages
- [ ] All links work
- [ ] Dark mode persists across navigation
- [ ] **Phase 4 done**

---

## PHASE 5 — Maps

### STEP 5.1 🖥️ Install Leaflet (in YOUR terminal)

```powershell
npm install leaflet react-leaflet @types/leaflet
```

### STEP 5.2 — Tell model to write map components

```
Phase 5. Leaflet installed. Now write map components.

Read map-specialist.md in .opencode/agents/ for full specs.

Write these files:
1. src/hooks/useGeolocation.ts — wraps navigator.geolocation, returns { latitude, longitude, loading, error }, refresh() function
2. src/components/map/Markers.tsx — custom blood group divIcon markers
3. src/components/map/DonorMap.tsx — Leaflet map with donor markers, user location marker, radius circle overlay
4. src/components/map/LocationPicker.tsx — map with draggable marker for registration forms
5. src/components/map/RadiusSliderMap.tsx — combined map + radius slider

Import leaflet CSS: import "leaflet/dist/leaflet.css"
Use L.divIcon for markers (NOT default L.icon — it breaks in bundlers).
```

### STEP 5.3 🖥️ Build and fix

```powershell
npm run build
```

Common errors & fixes to tell model:

| Error | Tell model |
|---|---|
| `Cannot find module 'leaflet'` | "Check that leaflet is in dependencies" |
| `Module not found: leaflet/dist/leaflet.css` | "Add `import 'leaflet/dist/leaflet.css'` in main.tsx" |
| `MapContainer is not a function` | "Fix the react-leaflet import" |
| `Default marker icon not found` | "Use L.divIcon instead of L.icon — already in spec" |
| `'MapContainer' cannot be used as a JSX component` | "Check react-leaflet version — use v4 syntax" |

- [ ] Fix → build → repeat until passes

### STEP 5.4 🖥️ Visually verify

```powershell
npm run dev
```

- [ ] Map tiles load?
- [ ] Donor markers show blood group labels?
- [ ] Radius circle renders and updates with slider?
- [ ] Click "Fetch My Live Location" → browser asks for permission?
- [ ] Report issues to model, fix until map works

---

## PHASE 6 — Polish & Deploy

### STEP 6.1 🖥️ Full QA

- [ ] `npm run dev`
- [ ] Visit EVERY page
- [ ] Click EVERY button
- [ ] Submit EVERY form
- [ ] Toggle dark mode on every page
- [ ] Check mobile responsive (F12 → toggle device toolbar)
- [ ] Write down ALL bugs

### STEP 6.2 — Fix bugs one by one

For each bug, tell model:

```
Bug: [page name] — [what happens] — [what should happen]
```

- [ ] Fix → build → verify → repeat

### STEP 6.3 🖥️ Final build

```powershell
npm run build
```

- [ ] **Zero errors**

### STEP 6.4 🖥️ Deploy

**Option A: Vercel**
```powershell
npm install -g vercel
vercel
```

**Option B: Netlify**
- Go to https://app.netlify.com
- Drag-and-drop `dist/` folder
- Or connect GitHub repo

**Option C: Firebase Hosting**
```powershell
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

---

## TROUBLESHOOTING

### "npm create vite" keeps cancelling

Run this in PowerShell **outside of opencode**:
```powershell
cd "E:\raktavahini web app"
Remove-Item -Recurse -Force src\, public\, node_modules\ -ErrorAction SilentlyContinue
Remove-Item -Force tsconfig*.json package.json vite.config.ts index.html -ErrorAction SilentlyContinue
npm create vite@latest . -- --template react-ts
# Type y when prompted
npm install
```

### Build fails after model writes code

```powershell
# Copy the FULL error
npm run build 2> build-error.txt
# Then paste build-error.txt content to model
```

### Dev server shows blank page

- Open browser DevTools (F12) → Console tab
- Look for red error messages
- Copy them and paste to model

### Model stops writing mid-way

Just say: `Continue. You still need to write [file names].`

### Model says "I cannot run this command"

That's correct — YOU run all commands. Tell the model:
`Just write the code files. I will run the commands myself.`

---

## SUMMARY: Your Role vs Model's Role

| You (Human) | Model (AI) |
|---|---|
| Run ALL terminal commands | Write ALL code files |
| Run `npm run build` after every change | Fix build errors |
| Run `npm run dev` to check visually | Describe how pages should look |
| Report bugs | Fix bugs reported |
| Deploy the app | Can't access the internet to deploy |
