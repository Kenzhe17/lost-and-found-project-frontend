import { useState } from "react";
import styles from "./ContactPage.module.css";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";

export default function ContactPage() {
  const email = "aaaa.ss@example.com";
  const phone = "8 707 777 77 77";
  const [copied, setCopied] = useState("");

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(`${label} copied`);
      window.setTimeout(() => setCopied(""), 1200);
    } catch {
      setCopied("Copy failed");
      window.setTimeout(() => setCopied(""), 1200);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact About Item</h1>
      <p className={styles.subtitle}>Contact the person regarding the selected item</p>

      <section className={styles.itemCard}>
        <img src="https://via.placeholder.com/400x300" alt="Gold Ring" />
        <div className={styles.itemInfo}>
          <h3>Gold Ring</h3>
          <p>
            <span role="img" aria-label="location">
              📍
            </span>{" "}
            Central Park
          </p>
          <p>
            <span role="img" aria-label="calendar">
              📅
            </span>{" "}
            2026-02-20
          </p>
          <p>
            <span role="img" aria-label="user">
              👤
            </span>{" "}
            naruto bek
          </p>
        </div>
      </section>

      <section className={styles.contactForm}>
        <h3>Contact Information</h3>
        <div className={styles.inputGroup}>
          <Input value={email} label="Email Address" readOnly />
          <Button type="button" variant="outline" onClick={() => handleCopy(email, "Email")}>
            Copy Email
          </Button>
        </div>
        <div className={styles.inputGroup}>
          <Input value={phone} label="Phone Number" readOnly />
          <Button type="button" variant="outline" onClick={() => handleCopy(phone, "Phone")}>
            Copy Phone
          </Button>
        </div>
        {copied ? <p className={styles.copied}>{copied}</p> : null}
      </section>
    </div>
  );
}
