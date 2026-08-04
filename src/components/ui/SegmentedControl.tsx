import { cn } from "@/lib/utils";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  name: string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  name,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn(
        "inline-flex rounded-md border border-(--color-border) bg-(--color-surface-raised) p-1",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded px-4 py-1.5 text-sm font-semibold transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)",
              selected
                ? "bg-(--color-primary) text-(--color-surface)"
                : "text-(--color-text-muted) hover:text-(--color-text)",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
