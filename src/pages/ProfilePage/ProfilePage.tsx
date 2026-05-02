import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import { getProfile } from "../../api/users";
import { getMyItems } from "../../api/items";
import type { UserProfile } from "../../types/user";
import type { Item } from "../../types/item";

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const [profileResponse, itemsResponse] = await Promise.all([getProfile(), getMyItems()]);
        setProfile(profileResponse);
        setItems(itemsResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const stats = useMemo(() => {
    const reported = items.length;
    const found = items.filter((item) => item.type === "FOUND").length;
    const active = items.filter((item) => item.status === "OPEN").length;
    return { reported, found, active };
  }, [items]);

  if (loading) {
    return (
      <main className={styles.state}>
        <p>Loading profile...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.state}>
        <p className={styles.error}>{error}</p>
      </main>
    );
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.name} className={styles.avatarImage} />
        ) : (
          <div className={styles.avatar}>{initialsFromName(profile?.name ?? "U")}</div>
        )}

        <h2>{profile?.name ?? "Unknown User"}</h2>
        <p>{profile?.email ?? "No email"}</p>

        <div className={styles.stats}>
          <div>
            <span>{stats.reported}</span>
            Reported
          </div>
          <div>
            <span>{stats.found}</span>
            Found
          </div>
          <div>
            <span>{stats.active}</span>
            Active
          </div>
        </div>

        <nav className={styles.nav}>
          <Link to="/home" className={styles.navLink}>
            Home
          </Link>
          <a href="#reported-items" className={`${styles.navLink} ${styles.active}`}>
            Reported Items
          </a>
          <Link to="/notifications" className={styles.navLink}>
            Notifications
          </Link>
          <Link to="/settings" className={styles.navLink}>
            Settings
          </Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <h1 id="reported-items">Your Reported Items</h1>

        {items.length === 0 ? <p className={styles.empty}>You have no reported items yet.</p> : null}

        <div className={styles.itemsList}>
          {items.map((item) => (
            <article key={item.id} className={styles.itemCard}>
              <img
                src={item.photos[0]?.url ?? "https://via.placeholder.com/400x300"}
                alt={item.title}
              />
              <div className={styles.itemInfo}>
                <h3>{item.title}</h3>
                <p>{item.location}</p>
                <p className={item.type === "LOST" ? styles.lost : styles.found}>
                  {item.type === "LOST" ? "Lost" : "Found"}
                </p>
              </div>
              <div className={styles.itemMeta}>
                {item.status === "OPEN" ? <span className={styles.activeBadge}>Active</span> : null}
                <span className={styles.date}>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
