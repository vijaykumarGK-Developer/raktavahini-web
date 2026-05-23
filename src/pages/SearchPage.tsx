import { useState } from "react";
import { useDonors } from "@/hooks/useDonors";
import { calculateDistance, calculateSmartScore } from "@/lib/utils";
import { bloodGroups } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import SkeletonCard from "@/components/shared/SkeletonCard";
import DonorCard from "@/components/shared/DonorCard";
import UserDetailModal from "@/components/shared/UserDetailModal";
import DonorMap from "@/components/map/DonorMap";
import { useToast } from "@/providers/ToastProvider";
import type { Donor } from "@/types";

export default function SearchPage() {
  const { donors, loading } = useDonors();
  const { toast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState("O+");
  const [radius, setRadius] = useState(20);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      toast("Geolocation is not supported by your browser.", "error");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast("Location fetched successfully", "success");
      },
      () => {
        setLocationError("Location access denied. Please enable location in your browser settings.");
        toast("Location access denied. Enable location and try again.", "warning");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const now = Date.now();
  const matches = donors
    .map((d) => {
      const daysSince = (now - d.lastDonationMs) / 86400000;
      const dist = userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, d.lat, d.lng)
        : d.distance ?? 0;
      return {
        ...d,
        calcDist: dist,
        smartScore: calculateSmartScore(dist, d.responseSpeed, d.activeDaysAgo, d.freq),
        isEligible: daysSince > 90,
      };
    })
    .filter((d) => d.group === selectedGroup && d.calcDist <= radius && d.isEligible)
    .sort((a, b) => a.smartScore - b.smartScore);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Find Eligible Donors</h1>

      <button
        onClick={fetchLocation}
        disabled={locating}
        className="w-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
      >
        {locating ? "Locating..." : "Fetch My Live Location"}
      </button>

      {locationError && (
        <p className="text-xs text-red-500 text-center">{locationError}</p>
      )}

      {userLocation && (
        <button
          onClick={() => setShowMap(!showMap)}
          className={`w-full font-bold py-3 rounded-xl transition-colors ${
            showMap
              ? "bg-rakta-red text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          {showMap ? "Show List" : "Show Map"}
        </button>
      )}

      {showMap && userLocation && (
        <DonorMap
          center={userLocation}
          radiusKm={radius}
          donorMarkers={matches.map((d) => ({
            lat: d.lat,
            lng: d.lng,
            label: d.group,
            uid: d.uid,
          }))}
          onMarkerClick={(uid) => {
            const donor = matches.find((d) => d.uid === uid);
            if (donor) setSelectedDonor(donor);
          }}
        />
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500 mb-1 block">Required Blood Group</label>
          <Select value={selectedGroup} onValueChange={(v) => v && setSelectedGroup(v)}>
            <SelectTrigger className="w-full h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bloodGroups.map((bg) => (
                <SelectItem key={bg} value={bg}>
                  {bg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-rakta-red mb-1 block">
            Search Radius: {radius} km
          </label>
          <Slider
            value={[radius]}
            onValueChange={(v) => {
              if (Array.isArray(v)) setRadius(v[0]);
              else if (typeof v === "number") setRadius(v);
            }}
            min={1}
            max={100}
          />
        </div>
      </div>

      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Intelligent Results</p>

      {loading || locating ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No eligible donors found within {radius} km.
        </p>
      ) : (
        matches.map((donor, i) => (
          <DonorCard
            key={donor.uid}
            donor={donor}
            isBestMatch={i === 0}
            onClick={() => setSelectedDonor(donor)}
          />
        ))
      )}

      {userLocation && (
        <p className="text-xs text-gray-400 text-center">
          Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </p>
      )}

      {selectedDonor && (
        <UserDetailModal donor={selectedDonor} onClose={() => setSelectedDonor(null)} />
      )}
    </div>
  );
}
