import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import type { Donor } from "@/types";

export function useCurrentUser() {
  const { user, loading: authLoading } = useAuth();
  const [currentUser, setCurrentUser] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        if (snap.exists()) {
          setCurrentUser({ uid: snap.id, ...snap.data() } as Donor);
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      }
    );
    return unsub;
  }, [user, authLoading]);

  return { currentUser, loading };
}

export async function updateCurrentUser(uid: string, data: Partial<Donor>): Promise<void> {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}
