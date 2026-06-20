import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";
import { C, grotesk, inter, mono } from "./theme";
import {
  Background,
  Mark,
  Reveal,
  Eyebrow,
  Title,
  Sub,
  Chip,
  Panel,
  WindowBar,
  gradText,
} from "./components";

/* Shared two-column scene shell: text left, mockup right. */
const Shell: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
}> = ({ left, right }) => (
  <Background>
    <AbsoluteFill
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: "0 120px",
        gap: 80,
      }}
    >
      <div style={{ flex: "0 0 42%", display: "flex", flexDirection: "column" }}>
        {left}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {right}
      </div>
    </AbsoluteFill>
  </Background>
);

const LeftText: React.FC<{
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  sub: string;
  chips: string[];
  badge?: string;
}> = ({ index, eyebrow, title, sub, chips, badge }) => (
  <>
    <Reveal>
      <div
        style={{
          fontFamily: mono,
          color: C.muted,
          fontSize: 20,
          letterSpacing: 2,
          marginBottom: 22,
        }}
      >
        {index}
      </div>
    </Reveal>
    <Reveal delay={6}>
      <Eyebrow>{eyebrow}</Eyebrow>
    </Reveal>
    <Reveal delay={12} style={{ marginTop: 22 }}>
      <Title size={72}>{title}</Title>
    </Reveal>
    {badge ? (
      <Reveal delay={18} style={{ marginTop: 22 }}>
        <div
          style={{
            display: "inline-flex",
            fontFamily: mono,
            fontSize: 17,
            color: C.accent,
            background: "rgba(79,91,247,0.14)",
            border: "1px solid rgba(79,91,247,0.4)",
            borderRadius: 999,
            padding: "8px 16px",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {badge}
        </div>
      </Reveal>
    ) : null}
    <Reveal delay={22} style={{ marginTop: 26 }}>
      <Sub>{sub}</Sub>
    </Reveal>
    <Reveal delay={30} style={{ marginTop: 30 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {chips.map((c) => (
          <Chip key={c}>{c}</Chip>
        ))}
      </div>
    </Reveal>
  </>
);

/* ------------------------------- INTRO ---------------------------------- */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  const scale = interpolate(s, [0, 1], [0.6, 1]);
  const rot = interpolate(s, [0, 1], [-12, 0]);
  return (
    <Background>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{ transform: `scale(${scale}) rotate(${rot}deg)`, opacity: s }}
        >
          <Mark size={150} />
        </div>
        <Reveal delay={16} style={{ marginTop: 44 }}>
          <Eyebrow>Il nostro lavoro</Eyebrow>
        </Reveal>
        <Reveal delay={24} style={{ marginTop: 20 }}>
          <Title size={84}>
            Prodotti reali, <span style={gradText}>in produzione.</span>
          </Title>
        </Reveal>
      </AbsoluteFill>
    </Background>
  );
};

/* ----------------------------- DOCSENSE --------------------------------- */
const DocSenseMock: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    ["Consulenza", "12", "€ 1.440", false],
    ["Sviluppo web", "1", "€ 4.900", false],
    ["Licenza SaaS", "3", "€ 270", false],
    ["Hosting", "1", "€ 1.900", true],
  ] as const;
  const scan = interpolate(frame, [20, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Panel delay={6} faceted style={{ width: 760 }}>
      <WindowBar label="docSense — analisi fatture" />
      <div style={{ display: "flex", padding: 28, gap: 24 }}>
        {/* invoice */}
        <div
          style={{
            flex: "0 0 150px",
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: 16,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 7,
                borderRadius: 4,
                background: i === 0 ? C.accent : C.border,
                width: i === 0 ? "70%" : `${90 - i * 7}%`,
                marginBottom: 11,
                opacity: interpolate(frame, [i * 4, i * 4 + 12], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />
          ))}
        </div>
        {/* extracted table */}
        <div style={{ flex: 1, position: "relative" }}>
          <div
            style={{
              display: "flex",
              fontFamily: mono,
              fontSize: 15,
              color: C.muted,
              paddingBottom: 12,
              borderBottom: `1px solid ${C.border}`,
              letterSpacing: 1,
            }}
          >
            <div style={{ flex: 1 }}>DESCRIZIONE</div>
            <div style={{ width: 60 }}>Q.TÀ</div>
            <div style={{ width: 110, textAlign: "right" }}>PREZZO</div>
          </div>
          {rows.map((r, i) => {
            const appear = interpolate(
              frame,
              [30 + i * 16, 42 + i * 16],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const flagged = r[3];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: inter,
                  fontSize: 19,
                  color: flagged ? C.red : C.text,
                  padding: "13px 0",
                  borderBottom: `1px solid ${C.border}`,
                  opacity: appear,
                  transform: `translateX(${interpolate(appear, [0, 1], [16, 0])}px)`,
                  background: flagged
                    ? "rgba(242,109,109,0.08)"
                    : "transparent",
                }}
              >
                <div style={{ flex: 1, display: "flex", gap: 8 }}>
                  {flagged ? <span>⚠️</span> : null}
                  {r[0]}
                </div>
                <div style={{ width: 60, color: C.muted }}>{r[1]}</div>
                <div style={{ width: 110, textAlign: "right" }}>{r[2]}</div>
              </div>
            );
          })}
          {/* anomaly badge */}
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: -54,
              fontFamily: mono,
              fontSize: 16,
              color: C.red,
              background: "rgba(242,109,109,0.12)",
              border: "1px solid rgba(242,109,109,0.4)",
              borderRadius: 8,
              padding: "8px 14px",
              opacity: interpolate(frame, [110, 124], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Anomalia rilevata · prezzo fuori range
          </div>
          {/* scan line */}
          <div
            style={{
              position: "absolute",
              left: -10,
              right: -10,
              top: `${interpolate(scan, [0, 1], [12, 88])}%`,
              height: 2,
              background: C.accent,
              boxShadow: `0 0 18px ${C.accent}`,
              opacity: scan > 0 && scan < 1 ? 0.8 : 0,
            }}
          />
        </div>
      </div>
    </Panel>
  );
};

export const DocSense: React.FC = () => (
  <Shell
    left={
      <LeftText
        index="01 / 04"
        eyebrow="Intelligenza Artificiale"
        title={
          <>
            doc<span style={gradText}>Sense</span>
          </>
        }
        badge="Costruito in poche ore"
        sub="Estrae i dati delle fatture, li concilia con il catalogo e segnala le anomalie in tempo reale."
        chips={["IA", "Estrazione dati", "Anomalie"]}
      />
    }
    right={<DocSenseMock />}
  />
);

/* ----------------------------- MATCHMOOD -------------------------------- */
const CodeLines: React.FC<{ start: number; tint: string }> = ({
  start,
  tint,
}) => {
  const frame = useCurrentFrame();
  const widths = [70, 92, 55, 80, 40, 66];
  return (
    <div style={{ padding: 18 }}>
      {widths.map((w, i) => {
        const grow = interpolate(
          frame,
          [start + i * 9, start + i * 9 + 12],
          [0, w],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <div
            key={i}
            style={{ display: "flex", gap: 8, marginBottom: 12 }}
          >
            <span style={{ width: 18, color: C.border, fontFamily: mono }}>
              {i + 1}
            </span>
            <span
              style={{
                height: 9,
                borderRadius: 4,
                width: `${grow}%`,
                background: i % 3 === 0 ? tint : C.border,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const MatchMoodMock: React.FC = () => {
  const frame = useCurrentFrame();
  const win = interpolate(frame, [150, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "relative", width: 820 }}>
      <div style={{ display: "flex", gap: 26 }}>
        <Panel delay={6} style={{ flex: 1 }}>
          <WindowBar label="player_1.ts" />
          <CodeLines start={20} tint={C.accent} />
          <div
            style={{
              opacity: win,
              padding: "0 18px 18px",
              fontFamily: mono,
              fontSize: 17,
              color: C.green,
            }}
          >
            ✓ Tutti i test superati
          </div>
        </Panel>
        <Panel delay={14} style={{ flex: 1 }}>
          <WindowBar label="player_2.ts" />
          <CodeLines start={36} tint={C.accent2} />
        </Panel>
      </div>
      {/* VS badge */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%,-50%) scale(${spring2(frame, 24)})`,
          width: 88,
          height: 88,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#4F5BF7,#8A6CFF)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: grotesk,
          fontWeight: 700,
          fontSize: 30,
          color: "#fff",
          boxShadow: "0 0 40px rgba(79,91,247,0.6)",
          border: "4px solid #0B0C0F",
        }}
      >
        VS
      </div>
      {/* live timer */}
      <div
        style={{
          position: "absolute",
          top: -52,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: mono,
          fontSize: 20,
          color: C.text,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: C.red,
          }}
        />
        LIVE · 01:24
      </div>
    </div>
  );
};

const spring2 = (frame: number, delay: number) => {
  const f = frame - delay;
  if (f < 0) return 0;
  return interpolate(f, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.6)),
  });
};

export const MatchMood: React.FC = () => (
  <Shell
    left={
      <LeftText
        index="02 / 04"
        eyebrow="Real-time"
        title="MatchMood"
        sub="Una piattaforma 1v1 di coding competitivo in tempo reale. Sfide, esecuzione del codice e valutazione istantanea."
        chips={["Real-time", "Multiplayer", "Pagamenti"]}
      />
    }
    right={<MatchMoodMock />}
  />
);

/* ------------------------------- ASROMA --------------------------------- */
const AsromaMock: React.FC = () => {
  const frame = useCurrentFrame();
  const players = [
    { x: 22, y: 30, c: C.accent, d: 10 },
    { x: 70, y: 22, c: C.accent2, d: 22 },
    { x: 56, y: 64, c: C.facetLight, d: 34 },
    { x: 30, y: 70, c: C.green, d: 46 },
  ];
  const coin = interpolate(frame % 90, [0, 90], [0, 1]);
  return (
    <Panel delay={6} faceted style={{ width: 760 }}>
      <WindowBar label="asroma.app — multiplayer" />
      <div
        style={{
          position: "relative",
          height: 420,
          background:
            "radial-gradient(circle at 50% 40%, rgba(79,91,247,0.12), transparent 60%)",
        }}
      >
        {/* board grid */}
        <AbsoluteFill
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* players */}
        {players.map((p, i) => {
          const s = spring2(frame, p.d);
          const float = Math.sin((frame + i * 20) / 18) * 6;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `translateY(${float}px) scale(${s})`,
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  background: p.c,
                  border: "3px solid #0B0C0F",
                  boxShadow: `0 0 24px ${p.c}88`,
                }}
              />
            </div>
          );
        })}
        {/* token coin moving */}
        <div
          style={{
            position: "absolute",
            left: `${interpolate(coin, [0, 1], [25, 68])}%`,
            top: `${interpolate(coin, [0, 1], [33, 60])}%`,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#FFD15C,#F6A609)",
            boxShadow: "0 0 18px rgba(246,166,9,0.7)",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ◎
        </div>
        {/* wallet chip */}
        <div
          style={{
            position: "absolute",
            right: 20,
            bottom: 18,
            fontFamily: mono,
            fontSize: 16,
            color: C.text,
            background: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "10px 14px",
            display: "flex",
            gap: 10,
            alignItems: "center",
            opacity: interpolate(frame, [40, 56], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span style={{ color: C.green }}>●</span> Wallet gestito · on-chain
        </div>
      </div>
    </Panel>
  );
};

export const Asroma: React.FC = () => (
  <Shell
    left={
      <LeftText
        index="03 / 04"
        eyebrow="Web3 & Blockchain"
        title="Asroma"
        sub="Una piattaforma Web3 multiplayer in produzione, con wallet gestiti per l'utente. Accessibile anche a chi non è del settore."
        chips={["Web3", "Multiplayer", "Wallet"]}
      />
    }
    right={<AsromaMock />}
  />
);

/* --------------------------- AUTOMAZIONE -------------------------------- */
const Node: React.FC<{
  icon: string;
  label: string;
  delay: number;
}> = ({ icon, label, delay }) => {
  const frame = useCurrentFrame();
  const s = spring2(frame, delay);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        transform: `scale(${s})`,
        opacity: s,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 22,
          background: C.surface,
          border: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 44,
          boxShadow: "0 16px 40px -12px rgba(0,0,0,0.6)",
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily: mono, fontSize: 17, color: C.muted }}>
        {label}
      </div>
    </div>
  );
};

const Wire: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dot = (frame - delay) % 40;
  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        height: 3,
        marginBottom: 38,
        background: C.border,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: `${grow * 100}%`,
          background: C.accent,
        }}
      />
      {grow >= 1 ? (
        <div
          style={{
            position: "absolute",
            top: -3,
            left: `${interpolate(dot, [0, 40], [0, 100])}%`,
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: C.accent2,
            boxShadow: `0 0 12px ${C.accent2}`,
          }}
        />
      ) : null}
    </div>
  );
};

const AutomazioneMock: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: 760 }}>
      <Panel delay={6} style={{ padding: "60px 40px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Node icon="📧" label="Email + PDF" delay={14} />
          <Wire delay={26} />
          <Node icon="🤖" label="IA" delay={40} />
          <Wire delay={52} />
          <Node icon="📨" label="Telegram" delay={66} />
        </div>
        <div
          style={{
            marginTop: 44,
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: interpolate(frame, [96, 112], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(frame, [96, 112], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}
        >
          <span style={{ fontSize: 26 }}>✅</span>
          <div style={{ fontFamily: inter, fontSize: 20, color: C.text }}>
            Preventivo inviato · inventario aggiornato
          </div>
        </div>
      </Panel>
    </div>
  );
};

export const Automazione: React.FC = () => (
  <Shell
    left={
      <LeftText
        index="04 / 04"
        eyebrow="Automazioni"
        title={
          <>
            Automazione <span style={gradText}>PMI</span>
          </>
        }
        badge="Montato in un giorno"
        sub="Legge email e PDF, concilia l'inventario e invia preventivi automaticamente. Ore di lavoro manuale eliminate."
        chips={["Automazione", "IA", "Integrazioni"]}
      />
    }
    right={<AutomazioneMock />}
  />
);

/* ------------------------------- OUTRO ---------------------------------- */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 16 } });
  return (
    <Background>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})` }}>
          <Mark size={110} />
        </div>
        <Reveal delay={12} style={{ marginTop: 36 }}>
          <Title size={68}>
            Costruiamo il software che fa{" "}
            <span style={gradText}>crescere</span> la tua impresa.
          </Title>
        </Reveal>
        <Reveal delay={26} style={{ marginTop: 40 }}>
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              fontFamily: grotesk,
              fontWeight: 600,
              fontSize: 30,
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg,#4F5BF7,#8A6CFF)",
                color: "#fff",
                borderRadius: 999,
                padding: "16px 34px",
                boxShadow: "0 14px 40px -8px rgba(79,91,247,0.6)",
              }}
            >
              Prenota una call
            </span>
            <span style={{ color: C.muted, fontFamily: mono, fontSize: 26 }}>
              fentriq.app
            </span>
          </div>
        </Reveal>
      </AbsoluteFill>
    </Background>
  );
};
