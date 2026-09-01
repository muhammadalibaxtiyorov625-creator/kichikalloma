import { useState } from "react";
import { cn } from "@/lib/utils";

/** Stylized 3D-ish planet sphere built from layered gradients (no image weight). */
export function Planet({
  size = 96,
  from,
  to,
  ring = false,
  image,
  className,
  glow = true,
}: {
  size?: number;
  /** oklch/var color strings from the design system */
  from: string;
  to: string;
  ring?: boolean;
  image?: string;
  className?: string;
  glow?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <span
      aria-hidden
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          className="animate-glow absolute inset-0 rounded-full blur-xl"
          style={{ background: to, opacity: 0.45 }}
        />
      )}
      {image && !imgError ? (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <img
            src={image}
            alt="Sayyora"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <>
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 32% 28%, color-mix(in oklab, ${from} 92%, white) 0%, ${from} 34%, ${to} 72%, color-mix(in oklab, ${to} 55%, black) 100%)`,
              boxShadow: `inset -${size * 0.09}px -${size * 0.09}px ${size * 0.22}px color-mix(in oklab, black 55%, transparent), 0 ${size * 0.12}px ${size * 0.3}px -${size * 0.15}px color-mix(in oklab, ${to} 60%, transparent)`,
            }}
          />
          <span
            className="absolute rounded-full opacity-70 blur-[2px]"
            style={{
              left: "22%",
              top: "16%",
              width: size * 0.22,
              height: size * 0.14,
              background: "oklch(1 0 0 / 0.55)",
              transform: "rotate(-24deg)",
            }}
          />
        </>
      )}
      {ring && (
        <span
          className="absolute left-1/2 top-1/2 rounded-[50%] border"
          style={{
            width: size * 1.75,
            height: size * 0.5,
            marginLeft: -(size * 1.75) / 2,
            marginTop: -(size * 0.5) / 2,
            transform: "rotate(-18deg)",
            borderColor: "oklch(0.83 0.16 87 / 0.55)",
            boxShadow: "0 0 18px -4px oklch(0.83 0.16 87 / 0.6)",
          }}
        />
      )}
    </span>
  );
}
