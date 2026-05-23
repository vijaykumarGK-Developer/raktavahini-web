import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Search, UserPlus, Building2, Smile, History, Settings, PhoneCall } from "lucide-react";
import { useAuth, signInWithGoogle, signOut as authSignOut } from "@/hooks/useAuth";
import { useToast } from "@/providers/ToastProvider";

const tabs = [
  { path: "/search", label: "Search", icon: Search },
  { path: "/register", label: "Profile", icon: UserPlus },
  { path: "/hospitals", label: "Hospitals", icon: Building2 },
  { path: "/donors", label: "Donors", icon: Smile },
  { path: "/history", label: "Log", icon: History },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSettings = () => navigate("/settings");

  const handleAuth = async () => {
    if (user) {
      try {
        await authSignOut();
        toast("Signed out", "info");
      } catch {
        toast("Sign out failed", "error");
      }
    } else {
      try {
        await signInWithGoogle();
        toast("Signed in with Google", "success");
      } catch {
        toast("Sign in failed", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-rakta-red text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">&#x1FA78;</span>
          <h1 className="text-lg font-extrabold">Rakta-Vahini</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAuth}
            className="text-xs font-medium bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
            title={user ? "Sign out" : "Sign in with Google"}
          >
            {user ? "Sign Out" : "Sign In"}
          </button>
          <button onClick={handleSettings} className="p-1" aria-label="Settings">
            <Settings className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="pb-20">
        <Outlet />
      </main>

      <button
        onClick={() => navigate("/emergency")}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-300 text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        aria-label="Emergency SOS"
      >
        <PhoneCall className="w-6 h-6" />
      </button>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
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
                aria-label={tab.label}
              >
                <Icon className="w-5 h-5 mb-0.5" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
