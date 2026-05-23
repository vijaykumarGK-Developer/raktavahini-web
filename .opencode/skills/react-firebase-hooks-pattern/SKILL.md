---
name: react-firebase-hooks-pattern
description: Use when creating Firebase Firestore real-time hooks for the Rakta-Vahini web app. Defines the standard pattern for typed collection/document hooks with onSnapshot listeners, loading states, and error handling. All sub-agents must follow this when reading/writing Firestore.
---

# React Firebase Hooks — Standard Pattern

Every Firestore hook in this project MUST follow this pattern to ensure consistency across sub-agents.

## Collection Hook Template

```ts
// src/hooks/useDonors.ts
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, doc, setDoc, updateDoc, deleteDoc, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Donor } from "../types";

export function useDonors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("name"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: Donor[] = snapshot.docs.map((d) => ({
          uid: d.id,
          ...d.data(),
        })) as Donor[];
        setDonors(list);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { donors, loading, error };
}
```

## Write Operation Functions

Separate write functions — NOT inside the hook — so they can be called independently:

```ts
// src/hooks/useDonors.ts (continued)

export async function addDonor(donor: Omit<Donor, "uid">): Promise<string> {
  const docRef = await addDoc(collection(db, "users"), donor);
  return docRef.id;
}

export async function updateDonor(uid: string, data: Partial<Donor>): Promise<void> {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}
```

## Where types live

All Firestore data types go in `src/types/index.ts`:

```ts
export interface Donor {
  uid: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  group: string;       // blood group
  phone: string;
  altPhone: string;
  address: string;
  lat: number;
  lng: number;
  lastDonationMs: number;
  responseSpeed: number;
  freq: number;        // donation frequency
  activeDaysAgo: number;
  // UI-computed (not in Firestore)
  distance?: number;
  calcDist?: number;
  smartScore?: number;
  isEligible?: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  email: string;
  phone: string;
  landline: string;
}

export interface DonationLog {
  id: string;
  userId: string;
  userName: string;
  timestamp: number;
  bloodGroup: string;
  hospitalName: string;
}

export interface EmergencyRequest {
  id: string;
  requesterId: string;
  bloodGroup: string;
  units: string;
  lat: number;
  lng: number;
  status: string;  // "ACTIVE" | "RESOLVED"
  timestamp: number;
}
```

## All required hooks

Create ONE file per collection:

| File | Hook | Write Functions |
|---|---|---|
| `src/hooks/useDonors.ts` | `useDonors()` | `addDonor()`, `updateDonor()` |
| `src/hooks/useHospitals.ts` | `useHospitals()` | `addHospital()`, `updateHospital()` |
| `src/hooks/useDonationLogs.ts` | `useDonationLogs()` | `addDonationLog()` |
| `src/hooks/useEmergencies.ts` | `useEmergencies()` | `broadcastEmergency()`, `resolveEmergency()` |
| `src/hooks/useAuth.ts` | `useAuth()` | `signInWithGoogle()`, `signOut()` |
| `src/hooks/useCurrentUser.ts` | `useCurrentUser()` | `updateCurrentUser()` |

## Rules

1. **Always use `onSnapshot`** for real-time sync (matching the Android app's `addSnapshotListener`)
2. **Always return `{ data, loading, error }`** shape from hooks
3. **Write functions are exported separately**, not returned from the hook
4. **Types go in `src/types/index.ts`**, never inline in hook files
5. **Use `setDoc(docRef, data, { merge: true })`** for updates (never overwrite the whole doc)
6. **Handle loading and error states** — the UI depends on them for skeletons and error toasts
7. **Clean up listeners** via the `useEffect` cleanup return
8. **Import `db` from `../lib/firebase`** — never re-initialize Firebase
