import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./FoundPage.module.css";
import Button from "../../components/ui/Button/Button";
import { getItems } from "../../api/items";
import type { Item } from "../../types/item";

const categories = ["All Items", "Electronics", "Bags", "Jewelry", "Accessories"];

function getStatusLabel(status: Item["status"]) {
  if (status === "OPEN") return "Unclaimed";
  if (status === "CLAIMED") return "Pending";
  return "Resolved";
}

export default function FoundPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await getItems();
        setItems(data.filter((item) => item.type === "FOUND"));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const textMatch = `${item.title} ${item.description ?? ""} ${item.location}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const categoryMatch =
        selectedCategory === "All Items" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      return textMatch && categoryMatch;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Found Items</h1>
        <Link to="/submit" className={styles.reportLink}>
          <Button>+ Report Found Item</Button>
        </Link>
      </header>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Search found items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className={styles.categoryFilters}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ""}`}
              onClick={() => setSelectedCategory(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p className={styles.state}>Loading found items...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {!loading && !error && visibleItems.length === 0 ? (
        <p className={styles.state}>No found items available.</p>
      ) : null}

      <div className={styles.itemsGrid}>
        {visibleItems.map((item) => (
          <article key={item.id} className={styles.itemCard}>
            <img
              src={item.photos[0]?.url ?? "https://via.placeholder.com/400x300"}
              alt={item.title}
            />
            <div className={styles.itemInfo}>
              <h3>{item.title}</h3>
              <p className={styles.location}>{item.location}</p>
              <p>{item.description ?? "No description provided."}</p>
              <p className={styles.date}>{new Date(item.date).toLocaleDateString()}</p>

              <span
                className={`${styles.status} ${
                  item.status === "OPEN"
                    ? styles.unclaimed
                    : item.status === "CLAIMED"
                      ? styles.pending
                      : styles.resolved
                }`}
              >
                {getStatusLabel(item.status)}
              </span>

              <Link to={`/items/${item.id}/claim`} className={styles.claimLink}>
                <Button variant="outline" fullWidth>
                  Claim Item
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
