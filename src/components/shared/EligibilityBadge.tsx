import { isEligible } from "@/lib/utils";

interface EligibilityBadgeProps {
  lastDonationMs: number;
}

export default function EligibilityBadge({ lastDonationMs }: EligibilityBadgeProps) {
  const eligible = isEligible(lastDonationMs);
  return (
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
        eligible
          ? "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300"
          : "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300"
      }`}
    >
      {eligible ? "✅ Eligible" : "🚫 Cooling Period"}
    </span>
  );
}
