import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Hospital } from "@/types";

export function useHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "hospitals"), orderBy("name"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: Hospital[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Hospital[];
        setHospitals(list);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { hospitals, loading, error };
}

export async function addHospital(hospital: Omit<Hospital, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "hospitals"), hospital);
  return docRef.id;
}

export async function updateHospital(id: string, data: Partial<Hospital>): Promise<void> {
  await setDoc(doc(db, "hospitals", id), data, { merge: true });
}
