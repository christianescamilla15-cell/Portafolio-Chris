import { memo } from "react";

const ProgressBar = memo(function ProgressBar({ value, color = "#6366F1" }) {
  return (
    <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}
      role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div style={{
        height: "100%", width: `${value}%`,
        background: value === 100
          ? "linear-gradient(90deg, #22C55E, #4ADE80)"
          : `linear-gradient(90deg, ${color}, #818CF8)`,
        borderRadius: 3, transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: `0 0 8px ${value === 100 ? "rgba(34,197,94,0.3)" : "rgba(99,102,241,0.3)"}`,
      }} />
    </div>
  );
});

export default ProgressBar;
