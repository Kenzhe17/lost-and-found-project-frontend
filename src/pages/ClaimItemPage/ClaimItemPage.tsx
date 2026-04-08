import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ClaimItemPage.module.css";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import Textarea from "../../components/ui/Textarea/Textarea";
import { createClaim, getItemById } from "../../api/items";
import { getProfile } from "../../api/users";
import type { Item } from "../../types/item";

export default function ClaimItemPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState<Item | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [proofFileName, setProofFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("Invalid item id.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [itemResponse, profileResponse] = await Promise.all([getItemById(id), getProfile()]);

        setItem(itemResponse);
        setName(profileResponse.name);
        setEmail(profileResponse.email);
        setPhone(profileResponse.phone ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load item.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;
    if (!name || !email || !phone || !description) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      // Backend claim endpoint currently supports one text message only.
      const message = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Description: ${description}`,
        additionalInfo ? `Additional info: ${additionalInfo}` : "",
        proofFileName ? `Proof file: ${proofFileName}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      await createClaim(id, message);
      setSuccess("Claim submitted successfully.");
      setTimeout(() => navigate("/profile"), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit claim.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.state}>
        <p>Loading item details...</p>
      </main>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Claim Item</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.finderInfo}>
          <h3>Item Information</h3>
          <div className={styles.infoRow}>
            <div>
              <p className={styles.label}>Item</p>
              <p>{item?.title ?? "Unknown item"}</p>
            </div>
            <div>
              <p className={styles.label}>Date</p>
              <p>{item ? new Date(item.date).toLocaleDateString() : "-"}</p>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div>
              <p className={styles.label}>Category</p>
              <p>{item?.category ?? "-"}</p>
            </div>
            <div>
              <p className={styles.label}>Status</p>
              <p>{item?.status ?? "-"}</p>
            </div>
          </div>
          <div>
            <p className={styles.label}>Location Found</p>
            <p>{item?.location ?? "-"}</p>
          </div>
          <p className={styles.helperText}>
            Finder contact details are shared after claim verification by the item owner.
          </p>
        </section>

        <section className={styles.claimForm}>
          <div className={styles.imageUpload}>
            <img src={item?.photos[0]?.url ?? "https://via.placeholder.com/400x300"} alt="Item" />
            <label className={styles.fileLabel}>
              Upload Proof of Ownership
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(e) => setProofFileName(e.target.files?.[0]?.name ?? "")}
                className={styles.fileInput}
              />
            </label>
            <p className={styles.helperText}>
              {proofFileName
                ? `Selected: ${proofFileName}`
                : "Upload an image showing proof of ownership"}
            </p>
          </div>

          <div className={styles.userInfo}>
            <Input
              label="Your Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Textarea
              label="Describe Your Item"
              placeholder="Provide details proving ownership"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Textarea
              label="Additional Information"
              placeholder="Any other relevant information"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />

            {error ? <p className={styles.error}>{error}</p> : null}
            {success ? <p className={styles.success}>{success}</p> : null}

            <div className={styles.actions}>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Claim"}
              </Button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
