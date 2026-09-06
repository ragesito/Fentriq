"use client";

/**
 * The three public formulas as one-tap presets for the new-client form.
 * Fills the monthly fee and total price inputs; both stay editable, since a
 * client can still be on an agreed custom pair (Aulon is 100 → 900 with a
 * booking system, agreed before Pro existed).
 */
const PLANS = {
  base: { label: "Formula", fee: 100, total: 900 },
  pro: { label: "Formula Pro", fee: 150, total: 1350 },
  max: { label: "Formula Max", fee: 200, total: 1800 },
} as const;

export function PlanPreset() {
  function apply(plan: keyof typeof PLANS) {
    const form = document.querySelector<HTMLFormElement>("form[data-client-form]");
    if (!form) return;
    const fee = form.elements.namedItem("monthlyFee") as HTMLInputElement | null;
    const total = form.elements.namedItem("totalPrice") as HTMLInputElement | null;
    if (fee) fee.value = String(PLANS[plan].fee);
    if (total) total.value = String(PLANS[plan].total);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted">Preset:</span>
      {(Object.keys(PLANS) as (keyof typeof PLANS)[]).map((plan) => (
        <button
          key={plan}
          type="button"
          onClick={() => apply(plan)}
          className="rounded-full border border-border bg-surface-2 px-3.5 py-1.5 text-sm text-text transition-colors hover:border-accent/60"
        >
          {PLANS[plan].label} · {PLANS[plan].fee} €/mes → {PLANS[plan].total} €
        </button>
      ))}
    </div>
  );
}
