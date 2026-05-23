import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { bloodGroups } from "@/lib/constants";
import { broadcastEmergency } from "@/hooks/useEmergencies";
import { useAuth, signInWithGoogle } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/providers/ToastProvider";

export default function EmergencyPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [group, setGroup] = useState("O+");
  const [units, setUnits] = useState("1");
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported.");
      toast("Geolocation is not supported.", "error");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast("Location fetched", "success");
      },
      () => {
        setLocationError("Location access denied. Please enable location in your browser settings.");
        toast("Location access denied.", "error");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleBroadcast = async () => {
    if (!user) {
      toast("You must be signed in to broadcast an SOS. Signing you in...", "info");
      try {
        await signInWithGoogle();
      } catch {
        toast("Sign-in failed. Please try again.", "error");
        return;
      }
    }

    if (!userLocation) {
      toast("Please fetch your location first.", "warning");
      return;
    }

    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    const unitsNum = parseInt(units, 10) || 1;
    setSending(true);
    try {
      await broadcastEmergency({
        requesterId: user!.uid,
        bloodGroup: group,
        units: unitsNum,
        lat: userLocation.lat,
        lng: userLocation.lng,
        status: "ACTIVE",
        timestamp: Date.now(),
      });
      toast(`SOS Broadcasted! Pushing to nearby ${group} donors.`, "success");
      setConfirmed(false);
      navigate("/donors");
    } catch {
      toast("Broadcast failed. Check console.", "error");
    } finally {
      setSending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="animate-pulse h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-rakta-red">Emergency Broadcast</h1>
      <p className="text-sm text-gray-500">
        This will send an SOS notification to eligible donors and verified
        hospitals in your radius.
      </p>

      {!user && (
        <div className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-center py-3 rounded-lg text-sm font-medium">
          You'll be prompted to sign in with Google when you broadcast.
        </div>
      )}

      <button
        onClick={fetchLocation}
        disabled={locating}
        className="w-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold py-3 rounded-xl disabled:opacity-50"
      >
        {locating ? "Locating..." : userLocation ? "Location Fetched" : "Fetch My Location"}
      </button>

      {locationError && (
        <p className="text-xs text-red-500 text-center">{locationError}</p>
      )}

      {userLocation && (
        <p className="text-xs text-gray-400 text-center">
          Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
        </p>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 space-y-4">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Needed Blood Group</label>
          <Select value={group} onValueChange={(v) => v && setGroup(v)}>
            <SelectTrigger className="w-full h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bloodGroups.map((bg) => (
                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Units Required</label>
          <input
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm"
            placeholder="Units Required"
            type="number"
            min="1"
          />
        </div>
      </div>

      {confirmed ? (
        <div className="space-y-3">
          <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 text-center py-3 rounded-lg font-bold">
            Are you sure? This will notify all nearby {group} donors.
          </div>
          <button
            onClick={handleBroadcast}
            disabled={sending}
            className="w-full py-4 rounded-xl text-white font-bold text-base bg-gradient-to-r from-red-500 to-orange-300 hover:opacity-90 disabled:opacity-50"
          >
            {sending ? "Broadcasting..." : "Confirm — Send SOS Now"}
          </button>
          <button
            onClick={() => setConfirmed(false)}
            className="w-full py-3 rounded-xl font-bold text-gray-500 border border-gray-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleBroadcast}
          className="w-full py-4 rounded-xl text-white font-bold text-base bg-gradient-to-r from-red-500 to-orange-300 hover:opacity-90"
        >
          Broadcast SOS Now
        </button>
      )}
    </div>
  );
}
