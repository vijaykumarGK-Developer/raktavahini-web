import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addHospital } from "@/hooks/useHospitals";
import { useAuth, signInWithGoogle } from "@/hooks/useAuth";
import { validateRequired, validatePhone, validateEmail } from "@/lib/utils";
import RaktButton from "@/components/shared/RaktButton";
import LocationPicker from "@/components/map/LocationPicker";
import { useToast } from "@/providers/ToastProvider";

export default function HospitalRegistrationPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [landline, setLandline] = useState("");
  const [email, setEmail] = useState("");
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
    const nameErr = validateRequired(name, "Hospital name");
    if (nameErr) { toast(nameErr, "error"); return; }
    const addrErr = validateRequired(address, "Address");
    if (addrErr) { toast(addrErr, "error"); return; }
    const phoneErr = validatePhone(phone);
    if (phoneErr) { toast(phoneErr, "error"); return; }
    const emailErr = validateEmail(email);
    if (emailErr) { toast(emailErr, "error"); return; }

    if (!user) {
      toast("You must be signed in to register a hospital. Signing you in...", "info");
      try {
        await signInWithGoogle();
      } catch {
        toast("Sign-in failed. Please try again.", "error");
        return;
      }
    }

    setSubmitting(true);
    try {
      await addHospital({
        name: name.trim(),
        address: address.trim(),
        lat,
        lng,
        email: email.trim(),
        phone: phone.trim(),
        landline: landline.trim(),
      });
      toast("Hospital registered!", "success");
      navigate("/hospitals");
    } catch {
      toast("Registration failed. Check console.", "error");
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
        <button
          onClick={() => navigate("/register")}
          className="flex-1 py-2 text-center text-gray-500 dark:text-gray-400 font-bold rounded-md hover:text-rakta-red"
        >
          Individual
        </button>
        <div className="flex-1 py-2 text-center bg-white dark:bg-gray-800 text-rakta-red font-bold rounded-md shadow-sm">
          Hospital
        </div>
      </div>

      <button
        onClick={fetchLocation}
        disabled={locating}
        className="w-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold py-3 rounded-xl disabled:opacity-50"
      >
        {locating ? "Locating..." : "Map Hospital Location"}
      </button>

      <LocationPicker lat={lat} lng={lng} onLocationChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 space-y-4">
        <p className="text-rakta-red font-bold">Hospital / Bank Details</p>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Hospital Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm" placeholder="Hospital Name" />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Address *</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm" placeholder="Address" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Emergency Mobile *</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm" placeholder="Mobile" type="tel" />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Landline</label>
            <input value={landline} onChange={(e) => setLandline(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm" placeholder="Landline" type="tel" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Official Email ID *</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm" placeholder="Email" type="email" />
        </div>

        <RaktButton onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Registering..." : "Register Hospital"}
        </RaktButton>
      </div>
    </div>
  );
}
