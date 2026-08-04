import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-(--color-primary) text-(--color-surface) hover:bg-(--color-primary-hover)",
  secondary:
    "bg-transparent text-(--color-text) border border-(--color-border) hover:border-(--color-primary)",
  ghost: "bg-transparent text-(--color-text-muted) hover:text-(--color-text)",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold",
        "transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background)",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
