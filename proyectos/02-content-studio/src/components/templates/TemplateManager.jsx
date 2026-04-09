import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveTemplate, loadTemplates, deleteTemplate, MAX_TEMPLATES } from "../../hooks/useTemplates.js";

const APPLE_EASE = [0.16, 1, 0.3, 1];

const PLATFORM_ICONS = {
  instagram: "\ud83d\udcf8",
  twitter: "\ud835\udd4f",
  linkedin: "\ud83d\udcbc",
  facebook: "\ud83d\udc65",
};

const TemplateManager = memo(function TemplateManager({ s, lang, brand, platform, tone, format, onLoadTemplate, onToast }) {
  const [templates, setTemplates] = useState(() => loadTemplates());
  const [templateName, setTemplateName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    const name = templateName.trim();
    if (!name) return;
    const { error, templates: updated } = saveTemplate(name, { brand, platform, tone, format });
    if (error === "max") {
      if (onToast) onToast(s.maxTemplates);
      return;
    }
    setTemplates(updated);
    setTemplateName("");
    if (onToast) onToast(lang === "es" ? `Plantilla "${name}" guardada` : `Template "${name}" saved`);
  };

  const handleDelete = (index) => {
    const updated = deleteTemplate(index);
    setTemplates(updated);
  };

  const handleLoad = (tmpl) => {
    if (onLoadTemplate) {
      onLoadTemplate(tmpl);
    }
    if (onToast) onToast(lang === "es" ? `Plantilla "${tmpl.name}" cargada` : `Template "${tmpl.name}" loaded`);
  };

  const accent = "#6366F1";

  return (
    <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={s.templates}
        aria-expanded={isOpen}
        style={{
          width: "100%", padding: "8px 12px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(99,102,241,0.12)", borderRadius: 12,
          fontSize: 11, fontWeight: 600, color: accent,
          cursor: "pointer", fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.08em", textAlign: "left",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <span>{isOpen ? "\u25bc" : "\u25b6"} {s.templates} ({templates.length}/{MAX_TEMPLATES})</span>
      </button>

      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: APPLE_EASE }}
          style={{ overflow: "hidden", marginTop: 8 }}
        >
          {/* Save new template */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value.slice(0, 40))}
              placeholder={s.templateName}
              aria-label={s.templateName}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              style={{
                flex: 1, padding: "7px 10px", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10,
                color: "#F8F4E8", fontSize: 11, fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <button
              onClick={handleSave}
              disabled={!templateName.trim()}
              aria-label={s.saveTemplate}
              style={{
                padding: "7px 14px", background: templateName.trim() ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${templateName.trim() ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 10, fontSize: 10, fontWeight: 700,
                color: templateName.trim() ? accent : "#4B5563",
                cursor: templateName.trim() ? "pointer" : "default",
                fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {s.saveTemplate}
            </button>
          </div>

          {/* Template list */}
          {templates.length === 0 && (
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0, textAlign: "center", padding: "8px 0" }}>
              {lang === "es" ? "Sin plantillas guardadas" : "No templates saved"}
            </p>
          )}
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            <AnimatePresence>
            {templates.map((tmpl, i) => (
              <motion.div
                key={tmpl.name + i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: APPLE_EASE }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", marginBottom: 4,
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <span style={{ fontSize: 14 }}>{PLATFORM_ICONS[tmpl.platform] || ""}</span>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: "#E2E8F0",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {tmpl.name}
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
                    {tmpl.platform} &middot; {tmpl.tone} &middot; {tmpl.format}
                  </div>
                </div>
                <button
                  onClick={() => handleLoad(tmpl)}
                  aria-label={`${s.loadTemplate}: ${tmpl.name}`}
                  style={{
                    padding: "3px 8px", background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6,
                    fontSize: 9, fontWeight: 600, color: accent,
                    cursor: "pointer", fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {s.loadTemplate}
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  aria-label={`${s.deleteTemplate}: ${tmpl.name}`}
                  style={{
                    padding: "3px 6px", background: "none",
                    border: "none", fontSize: 12, color: "#F87171",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
});

export default TemplateManager;
