"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
  /** Small secondary text shown at the right of the option. */
  hint?: string;
  /** What the closed field shows for this option (defaults to `label`). */
  triggerLabel?: string;
  /** Leading visual (a flag, an icon) shown before the label, and in the closed field. */
  icon?: ReactNode;
}

interface SelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  className?: string;
  /** Class for the wrapping element (width, flex behaviour). */
  rootClassName?: string;
  /** Extra classes for the popover (e.g. a fixed width). */
  popoverClassName?: string;
  "aria-invalid"?: boolean;
}

/**
 * A styled, accessible single-select (native <select> popups cannot be themed).
 * Combobox button + listbox popover; arrows / Home / End / Enter / Escape work,
 * so does clicking outside. Keeps the same visual language as the text inputs.
 */
export function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  className,
  rootClassName,
  popoverClassName,
  ...rest
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number>(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value);
  const typeahead = useRef<{ buf: string; at: number }>({ buf: "", at: 0 });

  // Close on outside click / focus leaving the widget.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the highlighted option visible while navigating a long list.
  useEffect(() => {
    if (!open || active < 0) return;
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, listId]);

  function openList() {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  }

  function choose(i: number) {
    const opt = options[i];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    // Type-ahead: letters typed in quick succession jump to the first option
    // starting with them (like a native select), whether open or closed.
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== " ") {
      e.preventDefault();
      const now = e.timeStamp;
      const t = typeahead.current;
      t.buf = now - t.at < 700 ? t.buf + e.key : e.key;
      t.at = now;
      const q = t.buf.toLowerCase();
      const i = options.findIndex((o) => o.label.toLowerCase().startsWith(q));
      if (i >= 0) {
        if (!open) setOpen(true);
        setActive(i);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) return openList();
        setActive((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) return openList();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        if (open) { e.preventDefault(); setActive(0); }
        break;
      case "End":
        if (open) { e.preventDefault(); setActive(options.length - 1); }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(active);
        else openList();
        break;
      case "Escape":
        if (open) { e.preventDefault(); setOpen(false); }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", rootClassName)}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={rest["aria-invalid"]}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-lg border bg-surface px-4 py-3 text-left text-sm transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          open ? "border-accent/60" : "border-border hover:border-border/80",
          selected ? "text-text" : "text-muted/60",
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected?.icon}
          <span className="truncate">{selected ? (selected.triggerLabel ?? selected.label) : placeholder}</span>
          {selected?.hint && !selected.triggerLabel ? (
            <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-on-accent">
              {selected.hint}
            </span>
          ) : null}
        </span>
        <ChevronDown
          size={16}
          aria-hidden
          className={cn("shrink-0 text-muted transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            id={listId}
            role="listbox"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute left-0 top-[calc(100%+6px)] z-30 max-h-72 w-full overflow-auto rounded-xl border border-border bg-surface/95 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl",
              popoverClassName,
            )}
          >
            {options.map((o, i) => {
              const isSel = o.value === value;
              const isActive = i === active;
              return (
                <li
                  key={o.value}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSel}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isSel
                      ? "bg-accent/15 font-medium text-text"
                      : isActive
                        ? "bg-surface-2 text-text"
                        : "text-text/90",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {o.icon}
                    {o.label}
                    {o.hint ? (
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-on-accent">
                        {o.hint}
                      </span>
                    ) : null}
                  </span>
                  {isSel ? <Check size={15} aria-hidden className="shrink-0 text-accent" /> : null}
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
