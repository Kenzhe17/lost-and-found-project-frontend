import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SubmitPage.module.css";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import Textarea from "../../components/ui/Textarea/Textarea";
import { createItem } from "../../api/items";

const categories = ["Electronics", "Bags", "Jewelry", "Accessories", "Others"];

export default function SubmitPage() {
  const navigate = useNavigate();

  const [reportType, setReportType] = useState<"LOST" | "FOUND">("LOST");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!itemName || !category || !location || !date || !description || !contact) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const fullDescription = `${description}\n\nContact: ${contact}`;

      await createItem({
        title: itemName,
        type: reportType,
        location,
        date,
        description: fullDescription,
        category,
        images,
      });

      setSuccess("Report submitted successfully.");
      setItemName("");
      setCategory("");
      setLocation("");
      setDate("");
      setDescription("");
      setContact("");
      setImages([]);

      navigate(reportType === "LOST" ? "/lost" : "/found");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Report an Item</h1>
      <p>Please provide as much detail as possible to help with identification.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.toggleButtons}>
          <button
            type="button"
            className={reportType === "LOST" ? styles.active : ""}
            onClick={() => setReportType("LOST")}
          >
            I Lost an Item
          </button>
          <button
            type="button"
            className={reportType === "FOUND" ? styles.active : ""}
            onClick={() => setReportType("FOUND")}
          >
            I Found an Item
          </button>
        </div>

        <Input
          label="Item Name*"
          placeholder="e.g., Black iPhone 14"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />

        <label className={styles.fieldLabel}>
          Category*
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.row}>
          <Input
            label="Location*"
            placeholder="Where was it lost/found?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <Input
            label="Date*"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <Textarea
          label="Description*"
          placeholder="Provide details about the item"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Input
          label="Contact Information*"
          placeholder="Your email or phone number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />

        <label className={styles.fieldLabel}>
          Images (up to 5)
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files ?? []).slice(0, 5))}
            className={styles.fileInput}
          />
        </label>

        {error ? <p className={styles.error}>{error}</p> : null}
        {success ? <p className={styles.success}>{success}</p> : null}

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </form>
    </div>
  );
}
