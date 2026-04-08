import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import Button from "../../components/ui/Button/Button";
import { useAuth } from "../../hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [street, setStreet] = useState("");

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>❤</span>
            <span>TapQoi</span>
          </div>

          <ul className={styles.navLinks}>
            <li>
              <Link to="/home">Home</Link>
            </li>
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
              <Link to="/profile" className={styles.profileLink}>
                Profile
              </Link>
            ) : (
              <>
                <Link to="/login" className={styles.actionLink}>
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link to="/signup" className={styles.actionLink}>
                  <Button>Sign up</Button>
                </Link>
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
            />
            <select value={street} onChange={(e) => setStreet(e.target.value)} className={styles.select}>
              <option value="">Select street</option>
              <option value="dostyk">Dostyk Avenue</option>
              <option value="tolebi">Tole Bi Street</option>
              <option value="abay">Abay Avenue</option>
            </select>
          </div>
          <div className={styles.reportButtons}>
            <Link to="/submit" className={styles.reportLink}>
              <button type="button" className={styles.lostBtn}>
                + Report Lost Item
              </button>
            </Link>
            <Link to="/submit" className={styles.reportLink}>
              <button type="button" className={styles.foundBtn}>
                + Report Found Item
              </button>
            </Link>
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
