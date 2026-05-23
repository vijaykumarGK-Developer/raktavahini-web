import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser, updateCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth, signInWithGoogle } from "@/hooks/useAuth";
import { bloodGroups } from "@/lib/constants";
import { validateName, validateAge, validatePhone, validateRequired } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RaktButton from "@/components/shared/RaktButton";
import { useToast } from "@/providers/ToastProvider";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { currentUser, loading: userLoading } = useCurrentUser();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [group, setGroup] = useState("O+");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setAge(String(currentUser.age));
      setGender(currentUser.gender);
      setGroup(currentUser.group);
      setPhone(currentUser.phone);
      setAltPhone(currentUser.altPhone);
      setAddress(currentUser.address);
    }
  }, [currentUser]);

  const handleSubmit = async () => {
    if (!user) {
      toast("You must be signed in to edit your profile. Signing you in...", "info");
      try {
        await signInWithGoogle();
      } catch {
        toast("Sign-in failed.", "error");
        return;
      }
    }

    const nameErr = validateName(name);
    if (nameErr) { toast(nameErr, "error"); return; }
    const ageNum = parseInt(age, 10);
    const ageErr = validateAge(ageNum);
    if (ageErr) { toast(ageErr, "error"); return; }
    const phoneErr = validatePhone(phone);
    if (phoneErr) { toast(phoneErr, "error"); return; }
    const addrErr = validateRequired(address, "Address");
    if (addrErr) { toast(addrErr, "error"); return; }

    setSubmitting(true);
    try {
      await updateCurrentUser(user!.uid, {
        name: name.trim(),
        age: ageNum,
        gender,
        group,
        phone: phone.trim(),
        altPhone: altPhone.trim(),
        address: address.trim(),
      });
      toast("Profile updated!", "success");
      navigate("/settings");
    } catch {
      toast("Update failed. Check console.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const loading = authLoading || userLoading;

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    );
  }

  if (!user || !currentUser) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <div className="bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-center py-6 rounded-lg">
          <p className="font-bold mb-2">No profile found</p>
          <p className="text-sm">Sign in and register as a donor first.</p>
          <button
            onClick={() => navigate("/register")}
            className="mt-4 bg-rakta-red text-white font-bold py-2 px-6 rounded-xl"
          >
            Register Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <p className="text-sm text-gray-500">Editing: {currentUser.name}</p>

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
    </div>
  );
}
