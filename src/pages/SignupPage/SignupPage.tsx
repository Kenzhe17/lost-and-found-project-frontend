import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignupPage.module.css";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import { register } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login: saveSession } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the terms to continue.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const response = await register({
        name: fullName,
        email,
        password,
      });
      saveSession(response.token, response.user);
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.brandMark} aria-hidden="true">
          ❤
        </div>
        <span className={styles.brandName}>TapQoi</span>
      </header>

      <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Create Account</h1>
          <p>Join to help reconnect lost items</p>
        </section>

        <section className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              error={error && !fullName ? error : ""}
            />
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              error={error && !email ? error : ""}
            />
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              showToggle
              helperText="Must be at least 8 characters long"
              required
              error={error && !password ? error : ""}
            />
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              showToggle
              required
              error={error && password !== confirmPassword ? error : ""}
            />

            <label className={styles.terms}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={() => setAgreeTerms((prev) => !prev)}
              />
              <span>
                I agree to the <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>
              </span>
            </label>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth disabled={!agreeTerms || submitting}>
              {submitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className={styles.divider}>Or sign up with</div>

          <Button type="button" variant="outline" fullWidth>
            Google
          </Button>
        </section>

        <p className={styles.login}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </main>
    </div>
  );
}
