import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">About</h1>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex justify-center">
          <span className="text-6xl">🩸</span>
        </div>
        <h2 className="text-xl font-bold text-center text-rakta-red">Rakta-Vahini</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Connecting blood donors with those in need — instantly.
        </p>

        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <p>
            Rakta-Vahini ("Blood Network" in Sanskrit) is a community-driven platform
            that bridges the gap between voluntary blood donors and emergency
            requirements. Our mission is to ensure no life is lost for want of blood.
          </p>
          <p>
            Every donor on our network is verified, rated by response speed, and
            mapped by location so that hospitals and patients can find the nearest
            match in critical moments.
          </p>
          <p>
            Built with ❤️ for the community. v1.0.0
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 space-y-3">
        <h3 className="font-bold">Key Features</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex gap-2">🔍 <span>Search donors by blood group &amp; location</span></li>
          <li className="flex gap-2">📍 <span>Map-based donor discovery</span></li>
          <li className="flex gap-2">🚨 <span>Emergency SOS requests</span></li>
          <li className="flex gap-2">📋 <span>Donation history &amp; certificates</span></li>
          <li className="flex gap-2">🏅 <span>Hero recognition &amp; lifetime stats</span></li>
        </ul>
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
