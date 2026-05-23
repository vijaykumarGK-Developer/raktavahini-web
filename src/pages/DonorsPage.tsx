import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDonors } from "@/hooks/useDonors";
import BloodBadge from "@/components/shared/BloodBadge";
import EligibilityBadge from "@/components/shared/EligibilityBadge";
import UserDetailModal from "@/components/shared/UserDetailModal";
import SkeletonCard from "@/components/shared/SkeletonCard";
import type { Donor } from "@/types";

export default function DonorsPage() {
  const navigate = useNavigate();
  const { donors, loading } = useDonors();
  const [selected, setSelected] = useState<Donor | null>(null);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Registered Donors</h1>

      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : donors.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No donors registered yet.</p>
      ) : (
        donors.map((donor) => (
          <div
            key={donor.uid}
            onClick={() => setSelected(donor)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <BloodBadge group={donor.group} />
              <div>
                <p className="font-bold text-base">{donor.name}</p>
                <p className="text-sm text-gray-500">
                  Age: {donor.age} • {donor.gender}
                </p>
                <EligibilityBadge lastDonationMs={donor.lastDonationMs} />
              </div>
            </div>
          </div>
        ))
      )}

      {selected && <UserDetailModal donor={selected} onClose={() => setSelected(null)} />}

      <button
        onClick={() => navigate("/register")}
        className="fixed bottom-44 right-4 z-50 w-14 h-14 rounded-full bg-rakta-red text-white text-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
}
