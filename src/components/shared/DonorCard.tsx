import BloodBadge from "./BloodBadge";
import type { Donor } from "@/types";

interface DonorCardProps {
  donor: Donor;
  isBestMatch: boolean;
  onClick: () => void;
}

export default function DonorCard({ donor, isBestMatch, onClick }: DonorCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <BloodBadge group={donor.group} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base">{donor.name}</span>
            {isBestMatch && (
              <span className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">
                🌟 Best Match
              </span>
            )}
          </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              📍 {donor.calcDist ?? donor.distance ?? "?"} km away
            </p>
        </div>
      </div>
    </div>
  );
}
