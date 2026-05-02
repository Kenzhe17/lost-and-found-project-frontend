import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./ItemsPage.module.css";
import { getItems } from "../../api/items";
import type { Item } from "../../types/item";

const categories = ["All Items", "Electronics", "Bags", "Jewelry", "Accessories", "Others"];
type TypeFilter = "ALL" | "LOST" | "FOUND";

function getStatusLabel(status: Item["status"]) {
  if (status === "OPEN") return "Unclaimed";
  if (status === "CLAIMED") return "Pending";
  return "Resolved";
}

export default function ItemsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("query") ?? "";
  const initialCity = searchParams.get("street") ?? "";
  const initialType = (searchParams.get("type")?.toUpperCase() as TypeFilter | null) ?? "ALL";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(
    initialType === "LOST" || initialType === "FOUND" ? initialType : "ALL",
  );
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await getItems();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("query", searchQuery.trim());
    if (cityFilter) params.set("street", cityFilter);
    if (typeFilter !== "ALL") params.set("type", typeFilter);
    setSearchParams(params, { replace: true });
  }, [searchQuery, cityFilter, typeFilter, setSearchParams]);

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const textMatch = `${item.title} ${item.description ?? ""} ${item.location}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const categoryMatch =
        selectedCategory === "All Items" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const cityMatch = !cityFilter || item.location.toLowerCase().includes(cityFilter.toLowerCase());

      const typeMatch = typeFilter === "ALL" || item.type === typeFilter;

      return textMatch && categoryMatch && cityMatch && typeMatch;
    });
  }, [items, searchQuery, selectedCategory, cityFilter, typeFilter]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Items</h1>
        <div className={styles.headerActions}>
          <Link to="/home" className={styles.homeLink}>
            Home
          </Link>
          <button type="button" className={styles.reportLink} onClick={() => navigate("/submit")}>
            + Report Item
          </button>
        </div>
      </header>

      <div className={styles.typeFilters}>
        <button
          type="button"
          className={`${styles.typeBtn} ${typeFilter === "ALL" ? styles.activeType : ""}`}
          onClick={() => setTypeFilter("ALL")}
        >
          All
        </button>
        <button
          type="button"
          className={`${styles.typeBtn} ${typeFilter === "LOST" ? styles.activeType : ""}`}
          onClick={() => setTypeFilter("LOST")}
        >
          Lost
        </button>
        <button
          type="button"
          className={`${styles.typeBtn} ${typeFilter === "FOUND" ? styles.activeType : ""}`}
          onClick={() => setTypeFilter("FOUND")}
        >
          Found
        </button>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className={styles.citySelect}
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">All cities</option>
          <option value="Алматы">Almaty</option>
          <option value="Астана">Astana</option>
          <option value="Шымкент">Shymkent</option>
        </select>

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

      {loading ? <p className={styles.state}>Loading items...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {!loading && !error && visibleItems.length === 0 ? (
        <p className={styles.state}>No items found.</p>
      ) : null}

      <div className={styles.itemsGrid}>
        {visibleItems.map((item) => (
          <article key={item.id} className={styles.itemCard}>
            <img src={item.photos[0]?.url ?? "https://via.placeholder.com/400x300"} alt={item.title} />
            <div className={styles.itemInfo}>
              <h3>{item.title}</h3>
              <p className={styles.location}>{item.location}</p>
              <p>{item.description ?? "No description provided."}</p>
              <p className={styles.date}>{new Date(item.date).toLocaleDateString()}</p>

              <span className={`${styles.status} ${item.type === "LOST" ? styles.lost : styles.found}`}>
                {item.type}
              </span>

              {item.type === "FOUND" ? (
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
              ) : null}

              <Link to={`/items/${item.id}/claim`} className={styles.claimLink}>
                Claim this item
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
