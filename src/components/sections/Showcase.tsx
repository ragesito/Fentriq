"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Home showreel: the rendered Remotion product montage. Lazy-loaded (the MP4
 * only starts downloading when scrolled near), autoplays muted + loops, with a
 * mute toggle so visitors can turn the sound on.
 */
export function Showcase() {
  const t = useTranslations("showcase");
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [muted, setMuted] = useState(true);

  // Load the video only when it scrolls into view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.play().catch(() => {});
    setMuted(v.muted);
  }

  return (
    <Section id="showreel" tone="default" className="pt-16 pb-20 sm:pt-20 sm:pb-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Reveal>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-[clamp(1.8rem,3.6vw,2.75rem)] font-semibold">
              {t("title")}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-muted">{t("subtitle")}</p>
        </Reveal>
      </div>

      <Reveal delay={0.05}>
        <div
          ref={wrapRef}
          className="group relative overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
        >
          <video
            ref={videoRef}
            className="block aspect-video w-full"
            poster="/showcase-poster.jpg"
            src={load ? "/showcase.mp4" : undefined}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
          />

          {/* Subtle accent frame on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[var(--radius)] ring-1 ring-inset ring-accent/0 transition-all duration-300 group-hover:ring-accent/30"
          />

          {/* Mute / unmute */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Attiva audio" : "Disattiva audio"}
            className="absolute bottom-4 right-4 flex h-11 items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 text-sm text-white backdrop-blur-md transition-colors hover:bg-black/70"
          >
            {muted ? (
              <>
                <VolumeX size={18} aria-hidden /> Audio
              </>
            ) : (
              <Volume2 size={18} aria-hidden />
            )}
          </button>

          {/* Placeholder play hint before the video loads */}
          {!load ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/90 text-on-accent">
                <Play size={26} aria-hidden />
              </span>
            </div>
          ) : null}
        </div>
      </Reveal>
    </Section>
  );
}
