import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";
import { classNames } from "../../../utils/classNames";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  showToggle?: boolean;
  helperText?: string;
};

export default function Input({
  label,
  error,
  type = "text",
  showToggle = false,
  helperText,
  className,
  id,
  ...rest
}: InputProps) {
  const [visible, setVisible] = useState(false);
  const actualType = showToggle ? (visible ? "text" : "password") : type;
  const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={styles.wrapper}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputShell}>
        <input
          id={inputId}
          type={actualType}
          className={classNames(styles.input, error && styles.inputError, className)}
          {...rest}
        />
        {showToggle && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
      {!error && helperText ? <p className={styles.helper}>{helperText}</p> : null}
    </div>
  );
}
