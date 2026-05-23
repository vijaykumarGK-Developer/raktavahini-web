import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { DonationLog } from "@/types";

export function useDonationLogs() {
  const [logs, setLogs] = useState<DonationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "donation_logs"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: DonationLog[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as DonationLog[];
        setLogs(list);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { logs, loading, error };
}

export async function addDonationLog(log: Omit<DonationLog, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "donation_logs"), log);
  return docRef.id;
}
