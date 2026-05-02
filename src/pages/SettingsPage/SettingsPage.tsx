import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SettingsPage.module.css";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import { getProfile, updateProfile } from "../../api/users";

type Tab = "Profile" | "Notifications" | "Account";

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await getProfile();
        setFullName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile settings.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const initials = useMemo(() => initialsFromName(fullName || "U"), [fullName]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await updateProfile({
        name: fullName,
        phone,
        profilePic,
      });
      setSuccess("Settings updated successfully.");
      setProfilePic(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.state}>
        <p>Loading settings...</p>
      </main>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topActions}>
        <Link to="/home" className={styles.homeLink}>
          Home
        </Link>
      </div>
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.subtitle}>Manage your account preferences and settings</p>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <button
            className={activeTab === "Profile" ? styles.active : ""}
            onClick={() => setActiveTab("Profile")}
            type="button"
          >
            Profile
          </button>
          <button
            className={activeTab === "Notifications" ? styles.active : ""}
            onClick={() => setActiveTab("Notifications")}
            type="button"
          >
            Notifications
          </button>
          <button
            className={activeTab === "Account" ? styles.active : ""}
            onClick={() => setActiveTab("Account")}
            type="button"
          >
            Account
          </button>
        </aside>

        <main className={styles.main}>
          {activeTab === "Profile" && (
            <section className={styles.profileSettings}>
              <h2>Profile Settings</h2>

              <div className={styles.avatarSection}>
                <div className={styles.avatar}>{initials}</div>
                <label className={styles.changePhotoLabel}>
                  Change Photo
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => setProfilePic(e.target.files?.[0])}
                    className={styles.fileInput}
                  />
                </label>
              </div>

              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                disabled
                helperText="Email is managed by account authentication."
              />
              <Input
                label="Phone Number"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {error ? <p className={styles.error}>{error}</p> : null}
              {success ? <p className={styles.success}>{success}</p> : null}

              <Button type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </section>
          )}

          {activeTab === "Notifications" && (
            <section className={styles.placeholder}>
              <h2>Notification Preferences</h2>
              <p>Notification preference settings will be connected in the next step.</p>
            </section>
          )}

          {activeTab === "Account" && (
            <section className={styles.placeholder}>
              <h2>Account Settings</h2>
              <p>Account security options will be connected in the next step.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
