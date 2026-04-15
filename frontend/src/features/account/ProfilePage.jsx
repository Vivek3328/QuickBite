import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { fetchCurrentUser, updateUserProfile } from "@/api/user";

export default function ProfilePage() {
  const { userToken, sync } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userToken) return;
    let cancelled = false;
    (async () => {
      try {
        const u = await fetchCurrentUser(userToken);
        if (!cancelled) {
          setName(u.name || "");
          setEmail(u.email || "");
        }
      } catch {
        if (!cancelled) toast.error("Could not load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userToken) return;
    setSaving(true);
    try {
      await updateUserProfile(userToken, { name });
      toast.success("Profile updated");
      sync();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Could not save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-ink-600">Loading…</div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink-900">Account</h1>
      <p className="mt-2 text-sm text-ink-600">Update how we greet you on the home page.</p>

      <form onSubmit={handleSubmit} className="surface-card mt-8 space-y-5 p-6">
        <div>
          <label htmlFor="profile-email" className="text-sm font-semibold text-ink-800">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            disabled
            className="input-field mt-2 cursor-not-allowed bg-ink-50"
          />
          <p className="mt-1 text-xs text-ink-500">Email cannot be changed here.</p>
        </div>
        <div>
          <label htmlFor="profile-name" className="text-sm font-semibold text-ink-800">
            Display name
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field mt-2"
            required
            minLength={2}
            maxLength={80}
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full !py-3">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
