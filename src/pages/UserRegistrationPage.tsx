import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth, signInWithGoogle } from "@/hooks/useAuth";
import { bloodGroups } from "@/lib/constants";
import { validateRequired, validatePhone, validateAge, validateName } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RaktButton from "@/components/shared/RaktButton";
import LocationPicker from "@/components/map/LocationPicker";
import { useToast } from "@/providers/ToastProvider";

export default function UserRegistrationPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [group, setGroup] = useState("O+");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(12.9716);
  const [lng, setLng] = useState(77.5946);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast("Geolocation is not supported.", "error");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocating(false);
        toast("Location fetched", "success");
      },
      () => {
        toast("Could not fetch location. Set it manually on the map.", "warning");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    const nameErr = validateName(name);
    if (nameErr) { toast(nameErr, "error"); return; }
    const ageNum = parseInt(age, 10);
    const ageErr = validateAge(ageNum);
    if (ageErr) { toast(ageErr, "error"); return; }
    const phoneErr = validatePhone(phone);
    if (phoneErr) { toast(phoneErr, "error"); return; }
    const addrErr = validateRequired(address, "Address");
    if (addrErr) { toast(addrErr, "error"); return; }

    if (!user) {
      toast("You must be signed in to register. Signing you in...", "info");
      try {
        await signInWithGoogle();
      } catch {
        toast("Sign-in failed. Please try again.", "error");
        return;
      }
    }

    setSubmitting(true);
    try {
      const uid = user!.uid;
      await setDoc(doc(db, "users", uid), {
        uid,
        name: name.trim(),
        email: user!.email || "",
        age: ageNum,
        gender,
        group,
        phone: phone.trim(),
        altPhone: altPhone.trim(),
        address: address.trim(),
        lat,
        lng,
        lastDonationMs: Date.now() - 100 * 86400000,
        responseSpeed: 10,
        freq: 0,
        activeDaysAgo: 0,
      });
      toast("Registered successfully!", "success");
      navigate("/donors");
    } catch {
      toast("Registration failed. Check console for details.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Registration Profile</h1>

      {!user && (
        <div className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-center py-3 rounded-lg text-sm font-medium">
          You'll be prompted to sign in with Google when you save.
        </div>
      )}

      <div className="flex gap-2 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
        <div className="flex-1 py-2 text-center bg-white dark:bg-gray-800 text-rakta-red font-bold rounded-md shadow-sm">
          Individual
        </div>
        <button
          onClick={() => navigate("/register-hospital")}
          className="flex-1 py-2 text-center text-gray-500 dark:text-gray-400 font-bold rounded-md hover:text-rakta-red"
        >
          Hospital
        </button>
      </div>

      <button
        onClick={fetchLocation}
        disabled={locating}
        className="w-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold py-3 rounded-xl disabled:opacity-50"
      >
        {locating ? "Locating..." : "Map My Current Location for Form"}
      </button>

      <LocationPicker lat={lat} lng={lng} onLocationChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 space-y-4">
        <p className="text-rakta-red font-bold">Personal Details</p>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Full Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm"
            placeholder="Full Name"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Age *</label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm"
              placeholder="Age"
              type="number"
              min={18}
              max={120}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Gender</label>
            <Select value={gender} onValueChange={(v) => v && setGender(v)}>
              <SelectTrigger className="w-full h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Male", "Female", "Other"].map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Blood Group</label>
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
            <label className="text-sm text-gray-500 mb-1 block">Primary Phone *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm"
              placeholder="Phone"
              type="tel"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Alt. Phone Number</label>
          <input
            value={altPhone}
            onChange={(e) => setAltPhone(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm"
            placeholder="Alt. Phone"
            type="tel"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Address *</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm"
            placeholder="Address"
          />
        </div>

        <RaktButton onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving..." : "Save User Profile"}
        </RaktButton>
      </div>
    </div>
  );
}
