import { memo } from "react";
import { T } from "../../constants/translations.js";
import { CURRENT_USER } from "../../constants/mockData.js";

const Sidebar = memo(function Sidebar({
  lang, activeSection, visitedSections, navItems, showAI,
  onSwitchSection, onToggleAI, apiKey, showApiKey, onToggleApiKey,
  onApiKeyChange, onResetData
}) {
  return (
    <div style={{
      width: 240, background: "rgba(255,255,255,0.02)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column",
      padding: "24px 0", position: "fixed",
      top: 0, left: 0, bottom: 0, zIndex: 10,
      transition: "box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#FAFAFA", letterSpacing: "-0.04em" }}>
          client<span style={{ color: "#6366F1" }}>hub</span>
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {T.portalSubtitle[lang]}
        </p>
      </div>

      {/* User */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6366F1, #4F46E5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, color: "#fff",
            boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
          }}>
            {CURRENT_USER.avatar}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#FAFAFA" }}>{CURRENT_USER.name}</p>
            <span style={{ fontSize: 10, background: "rgba(99,102,241,0.15)", color: "#818CF8", padding: "1px 7px", borderRadius: 10, fontWeight: 600 }}>
              {T.plan[lang]} {CURRENT_USER.plan}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav role="navigation" aria-label={lang === "es" ? "Navegacion principal" : "Main navigation"} style={{ flex: 1, padding: "12px 12px" }}>
        {navItems.map(item => {
          const isActive = activeSection === item.id;
          const hasUnvisited = !visitedSections[item.id] && item.count > 0;
          return (
            <button key={item.id} onClick={() => onSwitchSection(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 10, marginBottom: 2,
                background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                border: isActive ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: isActive ? "0 0 20px rgba(99,102,241,0.15), inset 0 0 20px rgba(99,102,241,0.05)" : "none",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; } }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, color: isActive ? "#818CF8" : "rgba(255,255,255,0.35)", transition: "color 0.3s" }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#818CF8" : "rgba(255,255,255,0.5)", transition: "all 0.3s" }}>
                  {item.label}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {hasUnvisited && (
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#EF4444", display: "inline-block",
                    animation: "bounce 2s ease-in-out infinite",
                    boxShadow: "0 0 8px rgba(239,68,68,0.5)",
                  }} />
                )}
                {item.count > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "1px 7px",
                    background: isActive ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)",
                    color: isActive ? "#818CF8" : "rgba(255,255,255,0.4)",
                    borderRadius: 10,
                    transition: "all 0.3s",
                  }}>
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* AI Button */}
      <div style={{ padding: "12px 12px 0" }}>
        <button onClick={onToggleAI}
          aria-label={T.aiAssistant[lang]}
          style={{
            width: "100%", padding: "11px 14px",
            background: showAI ? "linear-gradient(135deg, #6366F1, #4F46E5)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${showAI ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: 10, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: showAI ? "0 4px 20px rgba(99,102,241,0.4), 0 0 40px rgba(99,102,241,0.15)" : "none",
            backdropFilter: "blur(12px)",
          }}
          onMouseEnter={e => { if (!showAI) { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; } }}
          onMouseLeave={e => { if (!showAI) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; } }}
        >
          <span style={{ fontSize: 16 }}>&#10022;</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: showAI ? "#fff" : "#818CF8" }}>
            {T.aiAssistant[lang]}
          </span>
          <span style={{ marginLeft: "auto", fontSize: 9, padding: "2px 6px", borderRadius: 4, background: showAI ? "rgba(255,255,255,0.2)" : "rgba(99,102,241,0.15)", color: showAI ? "#fff" : "#818CF8", fontWeight: 700 }}>
            CLAUDE
          </span>
        </button>
      </div>

      {/* API Key Section */}
      <div style={{ padding: "8px 12px 0" }}>
        <button onClick={onToggleApiKey}
          aria-label={T.apiKeyLabel[lang]}
          style={{
            width: "100%", padding: "7px 10px", background: "transparent",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
        >
          <span>{T.apiKeyLabel[lang]}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
            background: apiKey ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
            color: apiKey ? "#4ADE80" : "#FBBF24",
          }}>{apiKey ? T.aiMode[lang] : T.demoMode[lang]}</span>
        </button>
        {showApiKey && (
          <div style={{ marginTop: 6, padding: "0 2px" }}>
            <input
              type="password"
              value={apiKey}
              onChange={e => onApiKeyChange(e.target.value)}
              placeholder="sk-ant-..."
              aria-label="Claude API Key"
              style={{
                width: "100%", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
                padding: "6px 8px", fontSize: 10, color: "#FAFAFA",
                fontFamily: "'DM Mono', monospace",
                background: "rgba(255,255,255,0.03)",
                transition: "border-color 0.3s",
              }}
            />
          </div>
        )}
      </div>

      {/* Reset Demo Data */}
      <div style={{ padding: "8px 12px 0" }}>
        <button onClick={onResetData}
          aria-label={T.resetData[lang]}
          style={{
            width: "100%", padding: "7px 10px", background: "transparent",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, cursor: "pointer",
            fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#F87171"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
        >
          {T.resetData[lang]}
        </button>
      </div>

      <p style={{ margin: "12px 20px 0", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {T.builtWith[lang]}
      </p>
    </div>
  );
});

export default Sidebar;
