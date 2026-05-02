import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import Button from "../../components/ui/Button/Button";
import { useAuth } from "../../hooks/useAuth";
import { getItems } from "../../api/items";
import type { Item } from "../../types/item";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [street, setStreet] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
      } catch {
        setItems([]);
      }
    };

    loadItems();
  }, []);

  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return items
      .filter((item) => {
        const textMatch = `${item.title} ${item.description ?? ""} ${item.location}`
          .toLowerCase()
          .includes(query);
        const cityMatch = !street || item.location.toLowerCase().includes(street.toLowerCase());
        return textMatch && cityMatch;
      })
      .slice(0, 6);
  }, [items, searchQuery, street]);

  const goToItemCollection = (item: Item) => {
    const params = new URLSearchParams();
    params.set("query", item.title);
    if (street) params.set("street", street);
    params.set("type", item.type);
    navigate(`/items?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>♥</span>
            <span>TapQoi</span>
          </div>

          <div className={styles.actions}>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className={styles.profileLink}>
                  Profile
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    logout();
                    navigate("/home");
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => navigate("/login")}>
                  Log in
                </Button>
                <Button type="button" onClick={() => navigate("/signup")}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </nav>

        <div className={styles.searchSection}>
          <h1>Lost something? Find it here</h1>
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrap}>
              <input
                className={styles.searchInput}
                placeholder="Search all items..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && searchQuery.trim() && suggestions.length > 0 ? (
                <div className={styles.suggestions}>
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={styles.suggestionItem}
                      onClick={() => {
                        setShowSuggestions(false);
                        goToItemCollection(item);
                      }}
                    >
                      <span className={styles.suggestionTitle}>{item.title}</span>
                      <span className={styles.suggestionMeta}>
                        {item.type} · {item.location}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <select value={street} onChange={(e) => setStreet(e.target.value)} className={styles.select}>
              <option value="">All cities</option>
              <option value="Алматы">Almaty</option>
              <option value="Астана">Astana</option>
              <option value="Шымкент">Shymkent</option>
            </select>
          </div>
          <div className={styles.searchActions}>
            <button type="button" className={styles.foundBtn} onClick={() => navigate("/submit")}>
              + Report Item
            </button>
          </div>
        </div>
      </header>

      <section className={styles.features}>
        <article className={styles.featureCard}>
          <div className={styles.icon}>+</div>
          <h3>Report Lost Items</h3>
          <p>Quickly report your lost items with details and images to increase your chances of finding them.</p>
        </article>
        <article className={styles.featureCard}>
          <div className={styles.icon}>🔍</div>
          <h3>Find Items</h3>
          <p>Search for items by category, location, and date.</p>
        </article>
        <article className={styles.featureCard}>
          <div className={styles.icon}>🛡️</div>
          <h3>Verification System</h3>
          <p>Ensures that items are returned to their rightful owners.</p>
        </article>
      </section>
    </div>
  );
}
