import { memo } from "react";
import { PLATFORMS } from '../../constants/platforms.js';
import { safeHex } from '../../constants/platforms.js';

const MockVisual = memo(function MockVisual({ colors, headline, platform, loading, loadingStep, s }) {
  const ratio = PLATFORMS.find(p => p.id === platform)?.ratio || "1:1";
  const [w, h] = ratio === "1:1" ? [1, 1] : ratio === "16:9" ? [16, 9] : [1.91, 1];
  const paddingBottom = `${(h / w) * 100}%`;

  const safeColors = (colors || []).map((c, i) => safeHex(c, ["#1a1a2e", "#16213e", "#0f3460"][i]));

  return (
    <div role="img" aria-label={headline || (s && s.defaultHeadline) || "Vista previa del contenido"} style={{ position: "relative", width: "100%", paddingBottom, borderRadius: 12, overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: loading
          ? "linear-gradient(135deg, #1a1a2e, #16213e)"
          : `linear-gradient(135deg, ${safeColors[0] || "#1a1a2e"}, ${safeColors[1] || "#16213e"}, ${safeColors[2] || "#0f3460"})`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transition: "background 1s ease",
      }}>
        {loading ? (
          <div style={{ textAlign: "center" }} role="status" aria-label={loadingStep || (s && s.generatingVisual) || "Generando visual..."}>
            <div style={{
              width: 160, height: 4, borderRadius: 2,
              background: "rgba(255,255,255,0.08)",
              margin: "0 auto 16px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: 2,
                background: "linear-gradient(90deg, #E8C547, #D4A017)",
                animation: "progressAnim 1.5s ease infinite",
              }} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "sans-serif", margin: 0 }}>
              {loadingStep || (s && s.generatingVisual) || "Generando visual..."}
            </p>
          </div>
        ) : (
          <>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)",
            }} />
            <div style={{ textAlign: "center", padding: 24, zIndex: 1 }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(14px, 3vw, 22px)",
                fontWeight: 700, color: "#fff",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                margin: "0 0 8px", lineHeight: 1.3,
              }}>
                {headline || (s && s.defaultHeadline) || "Tu contenido aqui"}
              </p>
              <div style={{
                fontSize: 10, color: "rgba(255,255,255,0.4)",
                fontFamily: "monospace", letterSpacing: "0.1em",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 4, padding: "3px 8px", display: "inline-block",
              }}>
                DALL-E 3 PREVIEW
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default MockVisual;
