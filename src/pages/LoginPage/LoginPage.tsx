import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import { login } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: saveSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const response = await login({ email, password });
      saveSession(response.token, response.user);

      if (!remember) {
        // Future option: session storage support if needed
      }

      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
          <h1>Welcome Back</h1>
          <p>Sign in to continue to TapQoi</p>
        </section>

        <section className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              showToggle
              error={error && !password ? error : ""}
            />

            <div className={styles.options}>
              <label className={styles.remember}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember((prev) => !prev)}
                />
                Remember me
              </label>
              <a href="#" className={styles.forgot}>
                Forgot password?
              </a>
            </div>

            {error && email && password ? <p className={styles.error}>{error}</p> : null}

            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className={styles.divider}>Or continue with</div>

          <Button type="button" variant="outline" fullWidth>
            Google
          </Button>
        </section>

        <p className={styles.signup}>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </main>
    </div>
  );
}
