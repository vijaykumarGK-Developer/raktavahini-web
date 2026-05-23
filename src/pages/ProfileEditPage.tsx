import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDonors, updateDonor } from "@/hooks/useDonors";
import { bloodGroups } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RaktButton from "@/components/shared/RaktButton";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { donors } = useDonors();

  const [selectedUid, setSelectedUid] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [group, setGroup] = useState("O+");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selected = donors.find((d) => d.uid === selectedUid);

  useEffect(() => {
    if (selected) {
      setName(selected.name);
      setAge(selected.age);
      setGender(selected.gender);
      setGroup(selected.group);
      setPhone(selected.phone);
      setAltPhone(selected.altPhone);
      setAddress(selected.address);
    }
  }, [selected]);

  const handleSubmit = async () => {
    if (!selectedUid) {
      alert("Select a donor profile to edit.");
      return;
    }
    if (!name || !age || !phone || !address) {
      alert("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await updateDonor(selectedUid, { name, age, gender, group, phone, altPhone, address });
      alert("✅ Profile updated!");
      navigate("/settings");
    } catch {
      alert("Update failed. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Edit Profile</h1>

      <div>
        <label className="text-sm text-gray-500 mb-1 block">Select Donor</label>
        <Select value={selectedUid} onValueChange={(v) => v && setSelectedUid(v)}>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Choose a donor profile..." />
          </SelectTrigger>
          <SelectContent>
            {donors.map((d) => (
              <SelectItem key={d.uid} value={d.uid}>
                {d.name} — {d.group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selected && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 space-y-4">
          <p className="text-rakta-red font-bold">Personal Details</p>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Age</label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm"
                type="number"
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
              <label className="text-sm text-gray-500 mb-1 block">Primary Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm"
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
              type="tel"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm"
            />
          </div>

          <RaktButton onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </RaktButton>

          <button
            onClick={() => navigate("/settings")}
            className="w-full py-3 rounded-xl font-bold text-gray-500 border border-gray-300 dark:border-gray-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
