import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Donor } from "@/types";

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

export async function addDonor(donor: Omit<Donor, "uid">): Promise<string> {
  const docRef = await addDoc(collection(db, "users"), donor);
  return docRef.id;
}

export async function updateDonor(uid: string, data: Partial<Donor>): Promise<void> {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}
