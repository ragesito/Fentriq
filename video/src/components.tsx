import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
  spring,
  useVideoConfig,
} from "remotion";
import { C, grad, grotesk, inter, mono } from "./theme";

/* ----------------------------- Background ------------------------------- */
const Blob: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  ax: number;
  ay: number;
  speed: number;
  phase?: number;
}> = ({ x, y, size, color, opacity, ax, ay, speed, phase = 0 }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin((frame + phase) / speed) * ax;
  const dy = Math.cos((frame + phase) / (speed * 1.25)) * ay;
  return (
    <div
      style={{
        position: "absolute",
        left: x + dx,
        top: y + dy,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity,
        filter: `blur(${Math.round(size / 4)}px)`,
      }}
    />
  );
};

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const N = 18;
  const H = 1180;
  return (
    <>
      {Array.from({ length: N }).map((_, i) => {
        const seed = i * 97 + 13;
        const x = (seed * 137) % 1920;
        const baseY = (seed * 71) % H;
        const speed = 0.25 + (i % 4) * 0.12;
        const y = (((baseY - frame * speed) % H) + H) % H - 40;
        const sway = Math.sin((frame + i * 31) / 45) * 16;
        const size = 2 + (i % 3);
        const op = 0.08 + (i % 4) * 0.035;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 5 === 0 ? C.accent : C.facetLight,
              opacity: op,
            }}
          />
        );
      })}
    </>
  );
};

export const Background: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
    {/* dot grid */}
    <AbsoluteFill
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
        backgroundSize: "40px 40px",
        opacity: 0.5,
      }}
    />
    {/* soft, drifting glows (blended, not hard circles) */}
    <Blob x={-360} y={-420} size={1200} color={C.accent} opacity={0.12} ax={70} ay={50} speed={55} />
    <Blob x={1080} y={420} size={1100} color={C.accent2} opacity={0.1} ax={80} ay={60} speed={68} phase={120} />
    <Blob x={520} y={-240} size={820} color={C.accent} opacity={0.05} ax={60} ay={70} speed={80} phase={40} />
    {/* drifting particles */}
    <Particles />
    {/* vignette for depth */}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)",
      }}
    />
    {children}
  </AbsoluteFill>
);

/* ------------------------------ Logo mark ------------------------------- */
export const Mark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <mask id="fentriq-f">
        <rect x="0" y="0" width="100" height="100" fill="#fff" />
        <path
          d="M56 30 L42 54 L72 54 L58 78"
          fill="none"
          stroke="#000"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </mask>
    </defs>
    <g mask="url(#fentriq-f)">
      <path d="M26 30 L56 30 L42 54 L12 54 Z" fill={C.accent} />
      <path d="M56 30 L86 30 L72 54 L42 54 Z" fill={C.facetLight} />
      <path d="M42 54 L72 54 L58 78 L28 78 Z" fill={C.white} />
      <path d="M58 78 L72 54 L86 54 L72 78 Z" fill={C.accent2} />
    </g>
  </svg>
);

/* ---------------------------- Text reveals ------------------------------ */
export const Reveal: React.FC<{
  delay?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, y = 26, children, style }) => {
  const frame = useCurrentFrame();
  const f = frame - delay;
  const opacity = interpolate(f, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ty = interpolate(f, [0, 16], [y, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ opacity, transform: `translateY(${ty}px)`, ...style }}>
      {children}
    </div>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      fontFamily: mono,
      color: C.accent,
      textTransform: "uppercase",
      letterSpacing: 6,
      fontSize: 22,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    <span
      style={{ width: 40, height: 2, background: C.accent, display: "block" }}
    />
    {children}
  </div>
);

export const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
}> = ({ children, size = 64 }) => (
  <div
    style={{
      fontFamily: grotesk,
      fontWeight: 700,
      fontSize: size,
      color: C.text,
      letterSpacing: -1.5,
      lineHeight: 1.05,
    }}
  >
    {children}
  </div>
);

export const Sub: React.FC<{ children: React.ReactNode; w?: number }> = ({
  children,
  w = 620,
}) => (
  <div
    style={{
      fontFamily: inter,
      fontSize: 26,
      color: C.muted,
      lineHeight: 1.5,
      maxWidth: w,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: mono,
      fontSize: 18,
      color: C.muted,
      border: `1px solid ${C.border}`,
      background: C.surface,
      borderRadius: 8,
      padding: "8px 14px",
      letterSpacing: 1,
    }}
  >
    {children}
  </div>
);

/* ------------------------------- Panel ---------------------------------- */
export const Panel: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
  faceted?: boolean;
}> = ({ children, style, delay = 0, faceted = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18 } });
  const scale = interpolate(s, [0, 1], [0.94, 1]);
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
        transform: `scale(${scale})`,
        opacity,
        overflow: "hidden",
        clipPath: faceted
          ? "polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)"
          : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* --------------------------- Window chrome ------------------------------ */
export const WindowBar: React.FC<{ label?: string }> = ({ label }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "14px 18px",
      borderBottom: `1px solid ${C.border}`,
      background: C.surface2,
    }}
  >
    {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
      <span
        key={c}
        style={{ width: 12, height: 12, borderRadius: "50%", background: c }}
      />
    ))}
    {label ? (
      <span
        style={{
          fontFamily: mono,
          fontSize: 14,
          color: C.muted,
          marginLeft: 12,
        }}
      >
        {label}
      </span>
    ) : null}
  </div>
);

export const gradText: React.CSSProperties = {
  background: grad,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
