import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Phone chrome around a real mobile screenshot — rounded body, notch and a
 * hairline bezel. Pairs with BrowserFrame to show the same site responsive.
 */
export function PhoneFrame({
  src,
  alt = "",
  className,
  sizes = "160px",
  priority,
}: {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[440/952] overflow-hidden rounded-[14%/6.5%] border-[3px] border-[#1c1f27] bg-[#0d0f14] shadow-[0_18px_40px_-14px_rgba(0,0,0,0.75)] ring-1 ring-white/10",
        className,
      )}
    >
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      {/* Notch */}
      <span
        aria-hidden
        className="absolute left-1/2 top-[1.2%] h-[2.2%] w-[36%] -translate-x-1/2 rounded-full bg-[#0d0f14]"
      />
    </div>
  );
}
