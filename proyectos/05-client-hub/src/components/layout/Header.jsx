import { T } from "../../constants/translations.js";
import { CURRENT_USER } from "../../constants/mockData.js";
import { timeAgo } from "../../utils/projectUtils.js";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({
  lang, setLang, sectionTitle,
  notifications, showNotifications, setShowNotifications,
  unreadNotifCount, markAllNotificationsRead
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#FAFAFA", letterSpacing: "-0.03em" }}>
          {sectionTitle}
        </h1>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          {T.welcome[lang]} {CURRENT_USER.name}
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* Notification Bell */}
        <div style={{ position: "relative" }} data-tour="notif-bell">
          <button onClick={() => setShowNotifications(v => !v)} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8,
            width: 36, height: 36, cursor: "pointer", fontSize: 16, position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            backdropFilter: "blur(12px)",
            color: "rgba(255,255,255,0.6)",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            &#128276;
            {unreadNotifCount > 0 && (
              <span style={{
                position: "absolute", top: -4, right: -4,
                background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800,
                width: 16, height: 16, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 8px rgba(239,68,68,0.5)",
              }}>{unreadNotifCount}</span>
            )}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute", top: 42, right: 0, width: 320,
                  background: "rgba(20,20,25,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4)", zIndex: 100,
                  overflow: "hidden", backdropFilter: "blur(20px)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#FAFAFA" }}>{T.notifications[lang]}</span>
                  {unreadNotifCount > 0 && (
                    <button onClick={markAllNotificationsRead} style={{
                      background: "none", border: "none", fontSize: 11, color: "#818CF8",
                      cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                    }}>{T.markAllRead[lang]}</button>
                  )}
                </div>
                <div style={{ maxHeight: 240, overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <p style={{ padding: 16, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>{T.noNotifications[lang]}</p>
                  ) : notifications.map(n => (
                    <div key={n.id} style={{
                      padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                      background: n.read ? "transparent" : "rgba(99,102,241,0.05)",
                      display: "flex", gap: 10, alignItems: "flex-start",
                    }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                        background: n.type === "overdue" ? "#EF4444" : n.type === "ticket" ? "#F59E0B" : "#6366F1",
                        boxShadow: `0 0 6px ${n.type === "overdue" ? "rgba(239,68,68,0.4)" : n.type === "ticket" ? "rgba(245,158,11,0.4)" : "rgba(99,102,241,0.4)"}`,
                      }} />
                      <div>
                        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{n.text}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{timeAgo(n.ts, lang)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Language toggle */}
        <div style={{
          display: "flex", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden",
          backdropFilter: "blur(12px)",
        }}>
          <button onClick={() => setLang("es")} style={{
            padding: "8px 12px", fontSize: 11, fontWeight: lang === "es" ? 700 : 400,
            color: lang === "es" ? "#818CF8" : "rgba(255,255,255,0.4)",
            background: lang === "es" ? "rgba(99,102,241,0.12)" : "transparent",
            border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>ES</button>
          <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} />
          <button onClick={() => setLang("en")} style={{
            padding: "8px 12px", fontSize: 11, fontWeight: lang === "en" ? 700 : 400,
            color: lang === "en" ? "#818CF8" : "rgba(255,255,255,0.4)",
            background: lang === "en" ? "rgba(99,102,241,0.12)" : "transparent",
            border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>EN</button>
        </div>
        <div style={{
          fontSize: 11, color: "rgba(255,255,255,0.5)",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 8, padding: "8px 14px",
          backdropFilter: "blur(12px)",
        }}>
          {new Date().toLocaleDateString(lang === "es" ? "es-MX" : "en-US", { day: "2-digit", month: "short", year: "numeric" })}
        </div>
      </div>
    </div>
  );
}
