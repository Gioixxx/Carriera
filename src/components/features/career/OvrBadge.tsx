import { cn } from "@/lib/utils";

interface OvrBadgeProps {
  ovr: number;
  size?: "sm" | "md";
  className?: string;
}

function tierClasses(ovr: number): string {
  if (ovr >= 80) return "bg-(--color-ovr-gold) text-[#1b2320]";
  if (ovr >= 65) return "bg-(--color-ovr-silver) text-white";
  return "bg-(--color-ovr-bronze) text-white";
}

export function OvrBadge({ ovr, size = "md", className }: OvrBadgeProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg font-display leading-none",
        size === "md" ? "h-16 w-16 text-2xl" : "h-11 w-11 text-base",
        tierClasses(ovr),
        className,
      )}
    >
      {size === "md" ? <span className="text-[10px] tracking-[0.2em]">OVR</span> : null}
      <span>{ovr}</span>
    </div>
  );
}
