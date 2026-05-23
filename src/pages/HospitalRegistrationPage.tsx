import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addHospital } from "@/hooks/useHospitals";
import RaktButton from "@/components/shared/RaktButton";
import LocationPicker from "@/components/map/LocationPicker";

export default function HospitalRegistrationPage() {
  const navigate = useNavigate();
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
      alert("Geolocation is not supported.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocating(false);
      },
      () => { setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    if (!name || !address || !phone || !email) {
      alert("Please fill in Hospital Name, Address, Mobile, and Email.");
      return;
    }
    setSubmitting(true);
    try {
      await addHospital({ name, address, lat, lng, email, phone, landline });
      alert("✅ Hospital registered!");
      navigate("/hospitals");
    } catch {
      alert("Registration failed. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Registration Profile</h1>

      <div className="flex gap-2 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => navigate("/register")}
          className="flex-1 py-2 text-center text-gray-500 dark:text-gray-400 font-bold rounded-md hover:text-rakta-red"
        >
          👤 Individual
        </button>
        <div className="flex-1 py-2 text-center bg-white dark:bg-gray-800 text-rakta-red font-bold rounded-md shadow-sm">
          🏥 Hospital
        </div>
      </div>

      <button
        onClick={fetchLocation}
        disabled={locating}
        className="w-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold py-3 rounded-xl disabled:opacity-50"
      >
        {locating ? "📍 Locating..." : "📍 Map Hospital Location"}
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
