import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { EmergencyRequest } from "@/types";

export function useEmergencies() {
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "emergencies"), where("status", "==", "ACTIVE"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: EmergencyRequest[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as EmergencyRequest[];
        setEmergencies(list);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { emergencies, loading, error };
}

export async function broadcastEmergency(data: Omit<EmergencyRequest, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "emergencies"), data);
  return docRef.id;
}

export async function resolveEmergency(id: string): Promise<void> {
  await setDoc(doc(db, "emergencies", id), { status: "RESOLVED" }, { merge: true });
}
