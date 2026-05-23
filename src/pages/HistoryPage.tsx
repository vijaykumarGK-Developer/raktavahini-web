import { useDonationLogs } from "@/hooks/useDonationLogs";
import BloodBadge from "@/components/shared/BloodBadge";
import SkeletonCard from "@/components/shared/SkeletonCard";
import { formatFullDate } from "@/lib/utils";

export default function HistoryPage() {
  const { logs, loading } = useDonationLogs();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Donation Logs</h1>

      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : logs.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No donation logs yet.</p>
      ) : (
        logs.map((log) => (
          <div
            key={log.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-4"
          >
            <div className="flex items-center gap-4">
              <BloodBadge group={log.bloodGroup} />
              <div>
                <p className="font-bold">{log.userName}</p>
                <p className="text-sm text-green-700 dark:text-green-300 font-bold">
                  🏥 {log.hospitalName}
                </p>
                <p className="text-xs text-gray-500">{formatFullDate(log.timestamp)}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
