import RaktButton from "./RaktButton";
import RaktOutlinedButton from "./RaktOutlinedButton";
import type { Hospital } from "@/types";

interface HospitalDetailModalProps {
  hospital: Hospital;
  onClose: () => void;
}

export default function HospitalDetailModal({ hospital, onClose }: HospitalDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
      <div className="bg-rakta-red text-white px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} className="p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-lg font-bold">Details</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-2xl font-bold">{hospital.name}</p>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 space-y-2 text-sm">
          <p>📍 Address: {hospital.address}</p>
          <p>🌍 Map Coordinates: {hospital.lat} N, {hospital.lng} E</p>
          <p>✉️ Email: {hospital.email}</p>
          <p>📱 Mobile: {hospital.phone}</p>
          <p>☎️ Landline: {hospital.landline}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a href={`tel:${hospital.phone}`} target="_blank" rel="noopener noreferrer">
            <RaktButton>📞 Mobile</RaktButton>
          </a>
          <a href={`tel:${hospital.landline}`} target="_blank" rel="noopener noreferrer">
            <RaktOutlinedButton>☎️ Landline</RaktOutlinedButton>
          </a>
        </div>
      </div>
    </div>
  );
}
