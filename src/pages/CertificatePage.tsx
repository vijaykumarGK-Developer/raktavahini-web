import { useLocation, useNavigate } from "react-router-dom";

export default function CertificatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    name?: string;
    group?: string;
    freq?: number;
    hospitalName?: string;
  } | null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const certId = `RV-${now.getTime()}-${String(now.getFullYear()).slice(-2)}`;

  return (
    <div className="p-4 space-y-4">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-green-700">Donation Logged!</h1>
        <p className="text-sm text-gray-500">Eligibility timer reset to 90 days.</p>
      </div>

      <div className="border-4 border-rakta-red rounded-xl bg-white p-6 mx-auto max-w-sm shadow-lg">
        <div className="text-center space-y-3">
          <p className="text-rakta-red text-lg font-black tracking-widest uppercase">
            Certificate of Heroism
          </p>
          <div className="w-16 h-0.5 bg-rakta-red mx-auto" />
          <p className="text-xs text-gray-400">Rakta-Vahini Blood Donor Network</p>

          <div className="py-2">
            <p className="text-5xl">🩸</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {state?.name || "Anonymous Hero"}
            </p>
            <p className="text-sm text-gray-500">
              {state?.group ? `Blood Group ${state.group}` : ""}
            </p>
          </div>

          <p className="text-sm text-gray-700">
            This certifies a voluntary blood donation
          </p>
          <p className="text-sm text-gray-700">
            on <span className="font-bold text-gray-900">{dateStr}</span>
          </p>

          {state?.hospitalName && (
            <p className="text-xs text-gray-500">
              at <span className="font-medium">{state.hospitalName}</span>
            </p>
          )}

          {state?.freq != null && (
            <p className="text-xs text-rakta-red font-bold pt-1">
              ★ {state.freq} Lifetime {state.freq === 1 ? "Donation" : "Donations"}
            </p>
          )}

          <div className="w-16 h-0.5 bg-gray-300 mx-auto" />
          <p className="text-xs text-gray-400">ID: {certId}</p>
        </div>
      </div>

      <button
        onClick={() => window.print()}
        className="w-full bg-rakta-red text-white font-bold py-3 rounded-xl hover:bg-rakta-red-light"
      >
        📥 Save / Print Certificate
      </button>

      <button
        onClick={() => navigate("/history")}
        className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl"
      >
        View Donation History
      </button>
    </div>
  );
}
