import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
        <p>Last updated: May 2026</p>

        <h3 className="font-bold text-gray-900 dark:text-gray-100">1. Information We Collect</h3>
        <p>
          We collect personal information you provide during registration: name, age,
          gender, blood group, phone numbers, address, and location coordinates.
          Donation logs (timestamp, hospital name) are recorded when you log a donation.
        </p>

        <h3 className="font-bold text-gray-900 dark:text-gray-100">2. How We Use Your Data</h3>
        <p>
          Your data is used solely to connect blood donors with recipients in need.
          Location data enables proximity-based donor search. Donation history helps
          track eligibility intervals (90-day cooldown).
        </p>

        <h3 className="font-bold text-gray-900 dark:text-gray-100">3. Data Sharing</h3>
        <p>
          Your name, blood group, and phone number are visible to other users for
          coordination purposes. We do not sell or share your data with third parties.
        </p>

        <h3 className="font-bold text-gray-900 dark:text-gray-100">4. Data Retention</h3>
        <p>
          Profiles and donation logs are retained until you request deletion. Contact
          us to remove your data.
        </p>

        <h3 className="font-bold text-gray-900 dark:text-gray-100">5. Security</h3>
        <p>
          We use Firebase security rules and encryption in transit. However, no
          platform is 100% secure — use the service at your own discretion.
        </p>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-rakta-red font-bold"
      >
        ← Back
      </button>
    </div>
  );
}
