import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import type { Donor } from "@/types";

export function useCurrentUser() {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);

  const uid = user?.uid || "tester_777";

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      doc(db, "users", uid),
      (snap) => {
        if (snap.exists()) {
          setCurrentUser({ uid: snap.id, ...snap.data() } as Donor);
        } else {
          setCurrentUser({
            uid,
            name: user?.displayName || "Tester User",
            email: user?.email || "tester@example.com",
            age: "25",
            gender: "Male",
            group: "O+",
            phone: "9998887776",
            altPhone: "N/A",
            address: "Bangalore, India",
            lat: 12.9716,
            lng: 77.5946,
            lastDonationMs: Date.now() - 120 * 86400000,
            responseSpeed: 10,
            freq: 5,
            activeDaysAgo: 2,
          });
        }
        setLoading(false);
      }
    );
    return unsub;
  }, [uid]);

  return { currentUser, loading };
}

export async function updateCurrentUser(uid: string, data: Partial<Donor>): Promise<void> {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}
