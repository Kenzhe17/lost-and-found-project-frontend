import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./Button.module.css";
import { classNames } from "../../../utils/classNames";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    fullWidth?: boolean;
    variant?: "primary" | "outline";
  }
>;

export default function Button({
  children,
  className,
  fullWidth = false,
  variant = "primary",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classNames(
        styles.button,
        variant === "outline" ? styles.outline : styles.primary,
        fullWidth && styles.fullWidth,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
