"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { contactSchema, budgetOptions, type ContactInput } from "@/lib/contact-schema";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { DIAL_CODES, countryName, defaultDial } from "@/lib/dial-codes";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import "flag-icons/css/flag-icons.min.css";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact");
  const tf = useTranslations("contact.form");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [dial, setDial] = useState(() => defaultDial(locale));
  const dialOptions = useMemo(
    () =>
      DIAL_CODES.map(([iso, code]) => ({
        value: iso,
        label: `${countryName(iso, locale)} ${code}`,
        triggerLabel: code,
        icon: (
          <span
            aria-hidden
            className={`fi fi-${iso.toLowerCase()} shrink-0 rounded-[3px] text-[13px] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]`}
          />
        ),
      })).sort((a, b) =>
        a.value === "IT" ? -1 : b.value === "IT" ? 1 : a.label.localeCompare(b.label, locale),
      ),
    [locale],
  );
  const dialCode = DIAL_CODES.find(([iso]) => iso === dial)?.[1] ?? "";

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { locale, consent: false as unknown as true },
  });

  async function onSubmit(values: ContactInput) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          phone: values.phone ? `${dialCode} ${values.phone}`.trim() : "",
          locale,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      trackEvent("form_submit", { locale });
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius)] border border-accent/40 bg-gradient-to-br from-accent/10 to-transparent p-8 text-center">
        <CheckCircle2 className="mx-auto text-accent" size={40} aria-hidden />
        <h3 className="mt-4 text-xl font-semibold">{tf("successTitle")}</h3>
        <p className="mt-2 text-muted">{tf("success")}</p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          OK
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot — visually hidden, off-screen, not focusable */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_1.1fr_1.1fr]">
        <Field label={tf("name")} error={errors.name && tf("errors.name")} htmlFor="name">
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder={tf("namePlaceholder")}
            className={inputCls(!!errors.name)}
            {...register("name")}
          />
        </Field>
        <Field label={tf("email")} error={errors.email && tf("errors.email")} htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={tf("emailPlaceholder")}
            className={inputCls(!!errors.email)}
            {...register("email")}
          />
        </Field>
        <Field label={tf("budget")} htmlFor="budget" optional>
          <Controller
            name="budget"
            control={control}
            render={({ field }) => (
              <Select
                id="budget"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder={tf("budgetPlaceholder")}
                options={[
                  { value: "La Formula (100 €/mese)", label: tf("budgetFormula"), hint: tf("budgetFormulaHint") },
                  ...budgetOptions.map((b) => ({ value: b, label: b })),
                  { value: "undecided", label: tf("budgetUndecided") },
                ]}
              />
            )}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={tf("phone")} htmlFor="phone" optional>
          <div className="flex gap-2">
            <Select
              value={dial}
              onChange={setDial}
              options={dialOptions}
              placeholder="+"
              rootClassName="w-[6.75rem] shrink-0"
              className="px-3"
              popoverClassName="w-64"
            />
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={tf("phonePlaceholder")}
              className={cn(inputCls(false), "min-w-0 flex-1")}
              {...register("phone")}
            />
          </div>
        </Field>
        <Field label={tf("company")} htmlFor="company" optional>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            placeholder={tf("companyPlaceholder")}
            className={inputCls(false)}
            {...register("company")}
          />
        </Field>
      </div>

      <Field label={tf("message")} error={errors.message && tf("errors.message")} htmlFor="message">
        <textarea
          id="message"
          rows={5}
          placeholder={tf("messagePlaceholder")}
          className={cn(inputCls(!!errors.message), "resize-y")}
          {...register("message")}
        />
      </Field>

      <div>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border bg-surface accent-accent"
            {...register("consent")}
          />
          <span>
            {tf("consent")}{" "}
            <Link href="/privacy" className="text-accent underline-offset-2 hover:underline">
              {tf("consentLink")}
            </Link>
            .
          </span>
        </label>
        {errors.consent ? (
          <p className="mt-1.5 text-sm text-red-400">{tf("errors.consent")}</p>
        ) : null}
      </div>

      {status === "error" ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden />
          <div>
            <p className="font-medium">{tf("errorTitle")}</p>
            <p className="mt-0.5">{tf("error")}</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          <Send size={18} aria-hidden />
          {status === "submitting" ? tf("submitting") : tf("submit")}
        </Button>
        {status === "error" ? (
          <OpenChatButton size="lg">{t("form.chatFallback")}</OpenChatButton>
        ) : null}
      </div>
    </form>
  );
}

function inputCls(hasError: boolean): string {
  return cn(
    "w-full rounded-lg border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/60 transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    hasError ? "border-red-500/60" : "border-border focus:border-accent/60",
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-text">
        {label}
        {optional ? <span className="ml-1 text-muted">·</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
