import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold tracking-wide text-(--color-text-muted) uppercase"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-(--color-error)" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
