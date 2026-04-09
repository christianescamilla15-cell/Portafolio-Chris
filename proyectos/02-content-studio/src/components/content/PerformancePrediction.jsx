import { useMemo, memo, useState, useEffect } from "react";
import { predictPerformance } from "../../utils/performancePredictor.js";

const TIP_LABELS = {
  es: {
    addMoreContent: "Agrega mas contenido para mejorar el alcance",
    shortenContent: "Acorta el contenido para esta plataforma",
    addHashtags: "Agrega mas hashtags relevantes",
    reduceHashtags: "Reduce la cantidad de hashtags",
    addCTA: "Agrega un llamado a la accion claro",
    addEmojis: "Los emojis aumentan el engagement en esta plataforma",
    greatContent: "Excelente contenido — listo para publicar",
  },
  en: {
    addMoreContent: "Add more content to improve reach",
    shortenContent: "Shorten the content for this platform",
    addHashtags: "Add more relevant hashtags",
    reduceHashtags: "Reduce the number of hashtags",
    addCTA: "Add a clear call to action",
    addEmojis: "Emojis boost engagement on this platform",
    greatContent: "Great content — ready to publish",
  },
};

function getColor(score, max) {
  const ratio = score / max;
  if (ratio >= 0.7) return "#4ADE80";
  if (ratio >= 0.4) return "#FBBF24";
  return "#F87171";
}

function GaugeBar({ value, max, label, color }) {
  const [animWidth, setAnimWidth] = useState(0);
  const percentage = Math.min(100, (value / max) * 100);

  useEffect(() => {
    const timer = setTimeout(() => setAnimWidth(percentage), 50);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{
          fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)",
          fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em",
        }}>
          {label}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "'DM Mono', monospace" }}>
          {value}{max === 10 ? "/10" : "x"}
        </span>
      </div>
      <div style={{
        width: "100%", height: 6, background: "rgba(255,255,255,0.06)",
        borderRadius: 3, overflow: "hidden",
      }}>
        <div style={{
          width: `${animWidth}%`, height: "100%", background: color,
          borderRadius: 3, transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>
    </div>
  );
}

const PerformancePrediction = memo(function PerformancePrediction({ result, platform, tone, lang }) {
  const prediction = useMemo(() => {
    if (!result) return null;
    return predictPerformance(result, platform, tone, "general");
  }, [result, platform, tone]);

  if (!prediction) return null;

  const tipLabels = TIP_LABELS[lang] || TIP_LABELS.en;
  const s = lang === "es" ? {
    title: "Prediccion de Rendimiento",
    engagement: "Engagement",
    bestTime: "Mejor Horario",
    reach: "Multiplicador de Alcance",
    tips: "Sugerencias",
  } : {
    title: "Performance Prediction",
    engagement: "Engagement",
    bestTime: "Best Posting Time",
    reach: "Reach Multiplier",
    tips: "Tips",
  };

  const engagementColor = getColor(prediction.engagementScore, 10);
  const reachColor = getColor(prediction.reachMultiplier, 3);

  return (
    <div style={{
      marginTop: 12, padding: "14px 16px",
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16, animation: "fadeUp 0.3s ease",
    }}>
      <p style={{
        margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
        textTransform: "uppercase", color: "#6366F1", fontFamily: "'DM Mono', monospace",
      }}>
        {s.title}
      </p>

      <GaugeBar
        value={prediction.engagementScore}
        max={10}
        label={s.engagement}
        color={engagementColor}
      />

      <GaugeBar
        value={prediction.reachMultiplier}
        max={3}
        label={s.reach}
        color={reachColor}
      />

      {/* Best posting time */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
        background: "rgba(99,102,241,0.06)", borderRadius: 10, marginBottom: 10,
      }}>
        <span style={{ fontSize: 16 }}>{"\u{1F552}"}</span>
        <div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
            {s.bestTime}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>
            {prediction.bestPostingTime}
          </div>
        </div>
      </div>

      {/* Tips */}
      {prediction.tips.length > 0 && (
        <div>
          <p style={{
            margin: "0 0 6px", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.3)",
            fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            {s.tips}
          </p>
          {prediction.tips.map((tip, i) => (
            <div key={i} style={{
              fontSize: 11, color: tip === "greatContent" ? "#4ADE80" : "#FBBF24",
              padding: "3px 0", lineHeight: 1.5,
            }}>
              {tip === "greatContent" ? "\u2713" : "\u2022"} {tipLabels[tip] || tip}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default PerformancePrediction;
