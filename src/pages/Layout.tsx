import { Outlet, useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { path: "/search", label: "Search", icon: "🔍" },
  { path: "/register", label: "Profile", icon: "👤" },
  { path: "/hospitals", label: "Hospitals", icon: "🏥" },
  { path: "/donors", label: "Donors", icon: "😊" },
  { path: "/history", label: "Log", icon: "📅" },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Top Navbar */}
      <header className="bg-rakta-red text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-extrabold">🩸 Rakta-Vahini</h1>
        <button onClick={() => navigate("/settings")} className="p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Page Content */}
      <main className="pb-20">
        <Outlet />
      </main>

      {/* SOS FAB */}
      <button
        onClick={() => navigate("/emergency")}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-300 text-white text-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
      >
        🚨
      </button>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path || 
              (tab.path === "/register" && location.pathname.startsWith("/register"));
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center py-2 px-3 text-xs font-bold transition-colors ${
                  active
                    ? "text-rakta-red"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
