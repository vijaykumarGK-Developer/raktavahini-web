import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BloodBadge from "./BloodBadge";
import RaktButton from "./RaktButton";
import { formatFullDate, isEligible as checkEligible } from "@/lib/utils";
import { addDonationLog } from "@/hooks/useDonationLogs";
import { updateDonor } from "@/hooks/useDonors";
import type { Donor } from "@/types";

interface UserDetailModalProps {
  donor: Donor;
  onClose: () => void;
}

export default function UserDetailModal({ donor, onClose }: UserDetailModalProps) {
  const navigate = useNavigate();
  const eligible = checkEligible(donor.lastDonationMs);
  const [hospitalName, setHospitalName] = useState("");
  const [logging, setLogging] = useState(false);

  const handleLogDonation = async () => {
    const hName = hospitalName.trim() || "General Hospital";
    setLogging(true);
    try {
      await addDonationLog({
        userId: donor.uid,
        userName: donor.name,
        timestamp: Date.now(),
        bloodGroup: donor.group,
        hospitalName: hName,
      });
      await updateDonor(donor.uid, {
        lastDonationMs: Date.now(),
        freq: donor.freq + 1,
      });
      navigate("/certificate", {
        state: {
          name: donor.name,
          group: donor.group,
          freq: donor.freq + 1,
          hospitalName: hName,
        },
      });
    } catch {
      alert("Failed to log donation.");
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-rakta-red text-white px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} className="p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-lg font-bold">Details</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex flex-col items-center gap-2">
          <BloodBadge group={donor.group} size={80} textSize="32px" />
          <p className="text-2xl font-bold">{donor.name}</p>
          <p className="text-gray-500 font-bold">
            Age: {donor.age} • Gender: {donor.gender}
          </p>
          <span className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
            ★ {donor.freq} Lifetime Donations
          </span>
        </div>

        <div className={`text-center py-3 rounded-lg font-bold ${
          eligible
            ? "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300"
            : "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300"
        }`}>
          {eligible ? "✅ Eligible" : "🚫 Not Eligible"}
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 space-y-2 text-sm">
          <p>📍 Address: {donor.address}</p>
          <p>🕒 Last Donated: {formatFullDate(donor.lastDonationMs)}</p>
          <hr className="border-gray-200 dark:border-gray-700 my-2" />
          <p>📱 Primary Mobile: +91 {donor.phone}</p>
          <p>📞 Alternate Mobile: +91 {donor.altPhone}</p>
        </div>

        <a
          href={`tel:${donor.phone}`}
          className="block"
          target="_blank"
          rel="noopener noreferrer"
        >
          <RaktButton>📞 Secure Call</RaktButton>
        </a>

        <hr className="border-gray-200 dark:border-gray-700" />

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 space-y-3">
          <p className="font-bold">Log Donation</p>
          <p className="text-xs text-gray-500">Update timer to pause requests.</p>
          <input
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            placeholder="Hospital name (optional)"
            className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm"
          />
          <button
            onClick={handleLogDonation}
            disabled={logging}
            className="w-full bg-rakta-red text-white font-bold py-3 rounded-xl disabled:opacity-50"
          >
            {logging ? "Logging..." : "I Donated Today ❤️"}
          </button>
        </div>
      </div>
    </div>
  );
}
