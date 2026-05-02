import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./NotificationsPage.module.css";
import Button from "../../components/ui/Button/Button";
import { getItemClaims, getMyItems } from "../../api/items";

type NotificationType = "claim";

type Notification = {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: NotificationType;
};

const notificationFilters = ["All Notifications", "Unread", "Claims"] as const;

function formatTimeAgo(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<(typeof notificationFilters)[number]>(
    "All Notifications",
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const myItems = await getMyItems();
        const claimsByItem = await Promise.all(
          myItems.map(async (item) => ({
            item,
            claims: await getItemClaims(item.id),
          })),
        );

        const claimNotifications: Notification[] = claimsByItem
          .flatMap(({ item, claims }) =>
            claims.map((claim) => ({
              id: `claim-${claim.id}`,
              title: "Item Claim Request",
              message: `${claim.user.name} wants to claim "${item.title}"`,
              timeAgo: formatTimeAgo(claim.createdAt),
              read: false,
              type: "claim" as const,
            })),
          )
          .reverse();

        setNotifications(claimNotifications);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const visibleNotifications = useMemo(() => {
    if (activeFilter === "Unread") return notifications.filter((n) => !n.read);
    return notifications;
  }, [activeFilter, notifications]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className={styles.container}>
      <div className={styles.topActions}>
        <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
          Back
        </button>
        <Link to="/home" className={styles.homeLink}>
          Home
        </Link>
      </div>
      <header className={styles.header}>
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with your lost and found items</p>
        </div>
        <Button variant="outline" type="button" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </header>

      <div className={styles.filters}>
        {notificationFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`${styles.filterBtn} ${activeFilter === filter ? styles.active : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? <p className={styles.stateMessage}>Loading notifications...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {!loading && !error && visibleNotifications.length === 0 ? (
        <p className={styles.stateMessage}>No notifications yet.</p>
      ) : null}

      <div className={styles.notificationsList}>
        {visibleNotifications.map((n) => (
          <article key={n.id} className={`${styles.notificationCard} ${!n.read ? styles.unread : ""}`}>
            <div className={styles.icon}>{n.read ? "✓" : "•"}</div>
            <div className={styles.content}>
              <p className={styles.title}>{n.title}</p>
              <p className={styles.message}>{n.message}</p>
            </div>
            <div className={styles.time}>{n.timeAgo}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
