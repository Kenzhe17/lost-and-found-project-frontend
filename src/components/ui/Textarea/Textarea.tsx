import type { TextareaHTMLAttributes } from "react";
import styles from "./Textarea.module.css";
import { classNames } from "../../../utils/classNames";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export default function Textarea({ label, error, className, id, ...rest }: TextareaProps) {
  const textareaId = id ?? `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={styles.wrapper}>
      <label htmlFor={textareaId} className={styles.label}>
        {label}
      </label>
      <textarea
        id={textareaId}
        className={classNames(styles.textarea, error && styles.textareaError, className)}
        {...rest}
      />
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
