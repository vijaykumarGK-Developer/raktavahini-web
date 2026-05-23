import { useNavigate } from "react-router-dom";
import { useTheme } from "@/providers/ThemeProvider";

const rows = [
  {
    label: "Edit Profile",
    icon: "✏️",
    path: "/profile/edit",
  },
  {
    label: "About",
    icon: "ℹ️",
    path: "/about",
  },
  {
    label: "Privacy Policy",
    icon: "🔒",
    path: "/privacy",
  },
  {
    label: "Contact Us",
    icon: "📧",
    path: "/contact",
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">{isDark ? "🌙" : "☀️"}</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</span>
          </div>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              isDark ? "bg-rakta-red" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isDark ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
        {rows.map((r) => (
          <button
            key={r.path}
            onClick={() => navigate(r.path)}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-xl">{r.icon}</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{r.label}</span>
            <span className="ml-auto text-gray-400">›</span>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 pt-4">
        Rakta-Vahini v1.0.0
      </p>
    </div>
  );
}
