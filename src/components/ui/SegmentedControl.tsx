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
        "inline-flex max-w-full min-w-0 flex-wrap rounded-md border border-(--color-border) bg-(--color-surface-raised) p-1",
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
              "min-w-0 flex-1 rounded px-3 py-1.5 text-sm font-semibold transition-colors duration-150 sm:px-4",
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
