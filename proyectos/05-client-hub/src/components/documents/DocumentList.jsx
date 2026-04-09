import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { T } from "../../constants/translations.js";
import { FILE_ICONS } from "../../constants/colors.js";
import { fileTypeFromName, parseSizeMB } from "../../utils/documentUtils.js";

const APPLE_EASE = [0.16, 1, 0.3, 1];

export default function DocumentList({ documents, onUpload, projects, lang }) {
  const fileInputRef = useRef(null);
  const [filterProject, setFilterProject] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      onUpload({
        name: file.name,
        type: fileTypeFromName(file.name),
        size: `${sizeMB} MB`,
        project: "General",
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  let filtered = [...documents];
  if (filterProject !== "all") filtered = filtered.filter(d => d.project === filterProject);
  if (filterType !== "all") filtered = filtered.filter(d => d.type === filterType);
  if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === "size") filtered.sort((a, b) => parseSizeMB(b.size) - parseSizeMB(a.size));
  else filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const uniqueProjects = [...new Set(documents.map(d => d.project))];
  const uniqueTypes = [...new Set(documents.map(d => d.type))];
  const selectStyle = {
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px",
    fontSize: 11, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.03)",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    backdropFilter: "blur(12px)", colorScheme: "dark",
    transition: "border-color 0.3s",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={filterProject} onChange={e => setFilterProject(e.target.value)} style={selectStyle}
            aria-label={T.allProjects[lang]}>
            <option value="all">{T.allProjects[lang]}</option>
            {uniqueProjects.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}
            aria-label={T.allTypes[lang]}>
            <option value="all">{T.allTypes[lang]}</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}
            aria-label={T.sortByDate[lang]}>
            <option value="date">{T.sortByDate[lang]}</option>
            <option value="name">{T.sortByName[lang]}</option>
            <option value="size">{T.sortBySize[lang]}</option>
          </select>
        </div>
        <div>
          <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileSelect} aria-label={T.uploadDoc[lang]} />
          <button onClick={() => fileInputRef.current?.click()}
            aria-label={T.uploadDoc[lang]}
            style={{
              background: "#6366F1", border: "none", borderRadius: 12,
              padding: "9px 18px", fontSize: 12, fontWeight: 700,
              color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.35)"; }}
          >
            {T.uploadDoc[lang]}
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {filtered.map((d, i) => {
          const fi = FILE_ICONS[d.type] || FILE_ICONS.default;
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: APPLE_EASE }}
              whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(99,102,241,0.1)" }}
              style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16,
                padding: "14px 16px", display: "flex", gap: 12, alignItems: "center",
                backdropFilter: "blur(12px)",
                cursor: "pointer",
                transition: "border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${fi.color}15`, border: `1px solid ${fi.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: fi.color,
                fontFamily: "'DM Mono', monospace",
                flexShrink: 0,
              }}>
                {fi.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 600, color: "#FAFAFA", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</p>
                <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{d.project} &middot; {d.size} &middot; {d.date}</p>
              </div>
              <button
                aria-label={`${T.download[lang]} ${d.name}`}
                style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6,
                  padding: "5px 10px", fontSize: 11, color: "#818CF8", cursor: "pointer",
                  fontWeight: 600, whiteSpace: "nowrap", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                {T.download[lang]}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
