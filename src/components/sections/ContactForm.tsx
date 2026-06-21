"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, AlertTriangle, Send, Workflow } from "lucide-react";
import { contactSchema, budgetOptions, type ContactInput } from "@/lib/contact-schema";
import { Button } from "@/components/ui/Button";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact");
  const tf = useTranslations("contact.form");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
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
        body: JSON.stringify({ ...values, locale }),
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
      <p className="flex items-start gap-2 rounded-lg border border-border bg-surface-2/50 p-3 text-sm text-muted">
        <Workflow size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
        {t("demoNote")}
      </p>

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

      <div className="grid gap-5 sm:grid-cols-2">
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
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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
        <Field label={tf("budget")} htmlFor="budget" optional>
          <select id="budget" className={inputCls(false)} defaultValue="" {...register("budget")}>
            <option value="" disabled>
              {tf("budgetPlaceholder")}
            </option>
            {budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
            <option value="undecided">{tf("budgetUndecided")}</option>
          </select>
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
