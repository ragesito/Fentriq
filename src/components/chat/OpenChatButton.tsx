"use client";

import { MessageSquare } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { OPEN_CHAT_EVENT } from "./ChatWidget";
import { cn } from "@/lib/cn";

/** Opens the floating ChatWidget from anywhere on the page. */
export function OpenChatButton({
  children,
  variant = "secondary",
  size = "md",
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT))}
      className={cn(buttonClasses(variant, size), className)}
    >
      <MessageSquare size={18} aria-hidden />
      {children}
    </button>
  );
}
