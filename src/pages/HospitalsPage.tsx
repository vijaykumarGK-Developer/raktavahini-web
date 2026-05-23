import { useState } from "react";
import { useHospitals } from "@/hooks/useHospitals";
import HospitalDetailModal from "@/components/shared/HospitalDetailModal";
import SkeletonCard from "@/components/shared/SkeletonCard";
import type { Hospital } from "@/types";

export default function HospitalsPage() {
  const { hospitals, loading } = useHospitals();
  const [selected, setSelected] = useState<Hospital | null>(null);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Verified Hospitals</h1>

      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : hospitals.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No hospitals registered yet.</p>
      ) : (
        hospitals.map((h) => (
          <div
            key={h.id}
            onClick={() => setSelected(h)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <p className="font-black text-base">{h.name}</p>
            <p className="text-sm text-gray-500 mt-1">📍 {h.address}</p>
          </div>
        ))
      )}

      {selected && <HospitalDetailModal hospital={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
