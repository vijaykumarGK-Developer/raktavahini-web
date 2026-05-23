# 🩸 Rakta-Vahini

**Rakta-Vahini** (रक्त वाहिनी — "Blood Stream") is a web application for connecting blood donors with hospitals and emergency blood requests. Built with React, TypeScript, Firebase, and Tailwind CSS.

## Features

- **Donor Search** — Find nearby donors by blood group and radius using geolocation
- **Interactive Map** — View donors and hospitals on a Leaflet map with distance-based filtering
- **Smart Scoring** — Donors ranked by response speed, frequency, distance, and eligibility
- **User Registration** — Register as a donor with personal details and location picker
- **Hospital Registration** — Register hospitals with location details
- **Emergency SOS** — Broadcast urgent blood requests with your current location
- **Donation History** — Track past donation logs
- **Certificate Generation** — Generate donation certificates after recording a donation
- **Settings & Profile** — Edit profile, manage theme, and app preferences
- **Google Auth** — Sign in with Google via Firebase Authentication

## Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| Framework      | React 19 + TypeScript                         |
| Build Tool     | Vite 6                                        |
| Styling        | Tailwind CSS 4 + shadcn/ui components         |
| Routing        | React Router 7                                |
| Backend        | Firebase (Firestore, Auth)                    |
| Maps           | Leaflet + react-leaflet                       |
| Icons          | Lucide React                                  |
| Font           | Geist Variable                                |

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication (Google provider) and Firestore enabled

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/vijaykumarGK-Developer/raktavahini-web.git
cd raktavahini-web
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Firebase**

Copy `.env.example` to `.env` and fill in your Firebase project credentials:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Start the dev server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── map/          # Leaflet map components (DonorMap, LocationPicker)
│   ├── shared/       # Reusable UI components (cards, badges, buttons, modals)
│   └── ui/           # shadcn/ui primitives
├── hooks/            # Firebase real-time hooks (useAuth, useDonors, useHospitals, etc.)
├── lib/              # Firebase config, utilities, constants
├── pages/            # Route pages (Search, Registration, Donors, Hospitals, etc.)
├── providers/        # Context providers (Auth, Theme)
├── types/            # TypeScript interfaces
└── App.tsx           # Root component with routing
```

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start development server     |
| `npm run build`   | TypeScript check + Vite build |
| `npm run preview` | Preview production build     |

## License

This project is for educational and community use.
