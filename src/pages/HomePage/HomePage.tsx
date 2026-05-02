import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import Button from "../../components/ui/Button/Button";
import { useAuth } from "../../hooks/useAuth";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [street, setStreet] = useState("");

  const goToSearch = (type: "lost" | "found") => {
    const params = new URLSearchParams();
    const query = searchQuery.trim();
    if (query) params.set("query", query);
    if (street) params.set("street", street);

    const base = type === "lost" ? "/lost" : "/found";
    const qs = params.toString();
    navigate(qs ? `${base}?${qs}` : base);
  };

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>♥</span>
            <span>TapQoi</span>
          </div>

          <ul className={styles.navLinks}>
            <li>
              <Link to="/lost">Lost Items</Link>
            </li>
            <li>
              <Link to="/found">Found Items</Link>
            </li>
            <li>
              <Link to="/submit">Report Item</Link>
            </li>
          </ul>

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
            <input
              className={styles.searchInput}
              placeholder="Search Lost Items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  goToSearch("lost");
                }
              }}
            />
            <select value={street} onChange={(e) => setStreet(e.target.value)} className={styles.select}>
              <option value="">All cities</option>
              <option value="Алматы">Almaty</option>
              <option value="Астана">Astana</option>
              <option value="Шымкент">Shymkent</option>
            </select>
          </div>
          <div className={styles.searchActions}>
            <button type="button" className={styles.lostBtn} onClick={() => goToSearch("lost")}>
              Search Lost
            </button>
            <button type="button" className={styles.foundBtn} onClick={() => goToSearch("found")}>
              Search Found
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
