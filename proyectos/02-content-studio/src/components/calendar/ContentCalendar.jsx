import { useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { getAllCalendarData, addToCalendar, removeFromCalendar } from "../../hooks/useCalendar.js";

const APPLE_EASE = [0.16, 1, 0.3, 1];
const ACCENT = "#6366F1";

const PLATFORM_COLORS = {
  instagram: "#EC4899",
  twitter: "#3B82F6",
  linkedin: "#6366F1",
  facebook: "#1E3A5F",
};

const PLATFORM_ICONS = {
  instagram: "\ud83d\udcf8",
  twitter: "\ud835\udd4f",
  linkedin: "\ud83d\udcbc",
  facebook: "\ud83d\udc65",
};

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function formatDateKey(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekDays(startDate) {
  const days = [];
  const monday = getMonday(startDate);
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function getMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const monday = getMonday(firstDay);
  const days = [];
  for (let i = 0; i < 35; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

const DAY_LABELS_ES = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
const DAY_LABELS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ContentCalendar = memo(function ContentCalendar({ s, lang, result, platform, onToast }) {
  const [viewMode, setViewMode] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState(() => getAllCalendarData());
  const [selectedCell, setSelectedCell] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);

  const dayLabels = lang === "es" ? DAY_LABELS_ES : DAY_LABELS_EN;

  const days = useMemo(() => {
    return viewMode === "week" ? getWeekDays(currentDate) : getMonthDays(currentDate);
  }, [viewMode, currentDate]);

  const today = formatDateKey(new Date());

  const navigateBack = () => {
    const d = new Date(currentDate);
    if (viewMode === "week") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const navigateForward = () => {
    const d = new Date(currentDate);
    if (viewMode === "week") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const handleAddToCalendar = (dateKey) => {
    if (!result) return;
    const entry = {
      headline: result.headline || "",
      platform: platform || "instagram",
      cta: result.cta || "",
      body: result.body || "",
    };
    const updated = addToCalendar(dateKey, entry);
    setCalendarData({ ...updated });
    if (onToast) onToast(s.addToCalendar || "Agregado al calendario");
  };

  const handleRemoveFromCalendar = (dateKey, index) => {
    const updated = removeFromCalendar(dateKey, index);
    setCalendarData({ ...updated });
    setSelectedCell(null);
  };

  const handleDrop = (e, dateKey) => {
    e.preventDefault();
    setDragOverDate(null);
    handleAddToCalendar(dateKey);
  };

  const handleDragOver = (e, dateKey) => {
    e.preventDefault();
    setDragOverDate(dateKey);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const monthLabel = currentDate.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    month: "long",
    year: "numeric",
  });

  const isCurrentMonth = (d) => d.getMonth() === currentDate.getMonth();
  const isWeekView = viewMode === "week";

  return (
    <div style={{ marginTop: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => setViewMode("week")}
            aria-label={s.weekView}
            style={{
              padding: "5px 12px", fontSize: 11, fontWeight: viewMode === "week" ? 700 : 400,
              background: viewMode === "week" ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              border: `1px solid ${viewMode === "week" ? ACCENT : "rgba(255,255,255,0.06)"}`,
              borderRadius: 10, color: viewMode === "week" ? ACCENT : "#6B7280",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: viewMode === "week" ? "0 0 12px rgba(99,102,241,0.15)" : "none",
            }}
          >
            {s.weekView}
          </button>
          <button
            onClick={() => setViewMode("month")}
            aria-label={s.monthView}
            style={{
              padding: "5px 12px", fontSize: 11, fontWeight: viewMode === "month" ? 700 : 400,
              background: viewMode === "month" ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              border: `1px solid ${viewMode === "month" ? ACCENT : "rgba(255,255,255,0.06)"}`,
              borderRadius: 10, color: viewMode === "month" ? ACCENT : "#6B7280",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: viewMode === "month" ? "0 0 12px rgba(99,102,241,0.15)" : "none",
            }}
          >
            {s.monthView}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={navigateBack} aria-label="Previous" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "4px 10px", color: "#6B7280", cursor: "pointer", fontSize: 14, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>&lsaquo;</button>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize", minWidth: 140, textAlign: "center" }}>{monthLabel}</span>
          <button onClick={navigateForward} aria-label="Next" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "4px 10px", color: "#6B7280", cursor: "pointer", fontSize: 14, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>&rsaquo;</button>
        </div>
      </div>

      {/* Day labels */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 2,
      }}>
        {dayLabels.map((label) => (
          <div key={label} style={{
            textAlign: "center", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)",
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "6px 0",
          }}>
            {label}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2,
        gridTemplateRows: isWeekView ? "1fr" : "repeat(5, 1fr)",
      }}>
        {days.map((day, idx) => {
          const dateKey = formatDateKey(day);
          const entries = calendarData[dateKey] || [];
          const isToday = dateKey === today;
          const isOtherMonth = !isWeekView && !isCurrentMonth(day);
          const isDragTarget = dragOverDate === dateKey;
          const hasContent = entries.length > 0;

          return (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.02, ease: APPLE_EASE }}
              role="button"
              tabIndex={0}
              aria-label={`${s.calendar} ${dateKey}${entries.length > 0 ? `, ${entries.length} ${lang === "es" ? "entradas" : "entries"}` : ""}`}
              onClick={() => setSelectedCell(selectedCell === dateKey ? null : dateKey)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedCell(selectedCell === dateKey ? null : dateKey); } }}
              onDrop={(e) => handleDrop(e, dateKey)}
              onDragOver={(e) => handleDragOver(e, dateKey)}
              onDragLeave={handleDragLeave}
              style={{
                minHeight: isWeekView ? 100 : 70,
                background: isDragTarget ? "rgba(99,102,241,0.15)" : isToday ? "rgba(99,102,241,0.06)" : isOtherMonth ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isToday ? "rgba(99,102,241,0.3)" : selectedCell === dateKey ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 10, padding: "4px 6px", cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                opacity: isOtherMonth ? 0.4 : 1,
                boxShadow: hasContent ? "0 0 8px rgba(99,102,241,0.08)" : "none",
              }}
            >
              <div style={{
                fontSize: 10, fontWeight: isToday ? 700 : 400,
                color: isToday ? ACCENT : "rgba(255,255,255,0.4)",
                fontFamily: "'DM Mono', monospace", marginBottom: 4,
              }}>
                {day.getDate()}
              </div>
              {entries.slice(0, isWeekView ? 3 : 2).map((entry, i) => (
                <div key={i} style={{
                  fontSize: 9, padding: "2px 4px", marginBottom: 2, borderRadius: 4,
                  background: `${PLATFORM_COLORS[entry.platform] || "#6366F1"}20`,
                  borderLeft: `2px solid ${PLATFORM_COLORS[entry.platform] || "#6366F1"}`,
                  color: "#E2E8F0", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                }}>
                  {PLATFORM_ICONS[entry.platform] || ""} {entry.headline?.substring(0, isWeekView ? 20 : 12)}
                </div>
              ))}
              {entries.length > (isWeekView ? 3 : 2) && (
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
                  +{entries.length - (isWeekView ? 3 : 2)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selected cell detail + add button */}
      {selectedCell && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: APPLE_EASE }}
          style={{
            marginTop: 8, padding: "12px",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#E2E8F0" }}>{selectedCell}</span>
            {result && (
              <button
                onClick={(e) => { e.stopPropagation(); handleAddToCalendar(selectedCell); }}
                aria-label={s.addToCalendar}
                style={{
                  padding: "4px 10px", fontSize: 10, fontWeight: 600,
                  background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: 8, color: "#818CF8", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                + {s.addToCalendar}
              </button>
            )}
          </div>
          {(calendarData[selectedCell] || []).length === 0 && (
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0, textAlign: "center", padding: "8px 0" }}>
              {lang === "es" ? "Sin contenido programado" : "No content scheduled"}
            </p>
          )}
          {(calendarData[selectedCell] || []).map((entry, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", marginBottom: 4,
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8,
            }}>
              <span style={{ fontSize: 14 }}>{PLATFORM_ICONS[entry.platform] || ""}</span>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: 11, color: "#E2E8F0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {entry.headline}
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{entry.cta?.substring(0, 40)}</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleRemoveFromCalendar(selectedCell, i); }}
                aria-label={s.removeFromCalendar}
                style={{
                  background: "none", border: "none", fontSize: 12, color: "#F87171",
                  cursor: "pointer", padding: "2px 6px",
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
});

export default ContentCalendar;
