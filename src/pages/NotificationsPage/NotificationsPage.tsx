import { useMemo, useState } from "react";
import styles from "./NotificationsPage.module.css";
import Button from "../../components/ui/Button/Button";

type NotificationType = "match" | "claim" | "general";

type Notification = {
  id: number;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: NotificationType;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Potential Match Found",
    message: "Someone has found an item matching your lost MacBook Pro",
    timeAgo: "2 hours ago",
    read: false,
    type: "match",
  },
  {
    id: 2,
    title: "Item Claim Request",
    message: "Sarah Miller wants to claim the iPhone you found",
    timeAgo: "5 hours ago",
    read: false,
    type: "claim",
  },
  {
    id: 3,
    title: "Report Verified",
    message: "Your lost item report has been verified and published",
    timeAgo: "1 day ago",
    read: true,
    type: "general",
  },
  {
    id: 4,
    title: "Status Update",
    message: "The status of your lost wallet report has been updated",
    timeAgo: "2 days ago",
    read: true,
    type: "general",
  },
  {
    id: 5,
    title: "New Match Alert",
    message: "A new item matching your lost keys has been posted",
    timeAgo: "3 days ago",
    read: false,
    type: "match",
  },
];

const notificationFilters = ["All Notifications", "Unread", "Matches", "Claims"] as const;

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof notificationFilters)[number]>(
    "All Notifications",
  );
  const [notifications, setNotifications] = useState(initialNotifications);

  const visibleNotifications = useMemo(() => {
    if (activeFilter === "Unread") return notifications.filter((n) => !n.read);
    if (activeFilter === "Matches") return notifications.filter((n) => n.type === "match");
    if (activeFilter === "Claims") return notifications.filter((n) => n.type === "claim");
    return notifications;
  }, [activeFilter, notifications]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className={styles.container}>
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
