import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./LostPage.module.css";
import { getItems } from "../../api/items";
import type { Item } from "../../types/item";

const categories = ["All Items", "Electronics", "Bags", "Jewelry", "Accessories", "Others"];

export default function LostPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") ?? "";
  const initialCity = searchParams.get("street") ?? "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await getItems();
        setItems(data.filter((item) => item.type === "LOST"));
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

      const cityMatch =
        !cityFilter || item.location.toLowerCase().includes(cityFilter.toLowerCase());

      return textMatch && categoryMatch && cityMatch;
    });
  }, [items, searchQuery, selectedCategory, cityFilter]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Lost Items</h1>
        <div className={styles.headerActions}>
          <Link to="/home" className={styles.homeLink}>
            Home
          </Link>
          <button type="button" className={styles.reportLink} onClick={() => navigate("/submit")}>
            + Report Lost Item
          </button>
        </div>
      </header>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Search lost items..."
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

      {loading ? <p className={styles.state}>Loading lost items...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {!loading && !error && visibleItems.length === 0 ? (
        <p className={styles.state}>No lost items found.</p>
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
              <Link to={`/items/${item.id}/claim`} className={styles.contactLink}>
                Claim this item
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
