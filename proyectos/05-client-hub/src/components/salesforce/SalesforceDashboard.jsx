import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { T } from "../../constants/translations.js";
import { getSalesforceService } from "../../services/salesforce.js";

const fmt = (n) => `$${n.toLocaleString("en-US")}`;
const APPLE_EASE = [0.16, 1, 0.3, 1];

const STAGE_COLORS = {
  Prospect:    { bg: "#1E293B", text: "#94A3B8", accent: "#475569" },
  Proposal:    { bg: "#1E1B4B", text: "#A5B4FC", accent: "#6366F1" },
  Negotiation: { bg: "#172554", text: "#93C5FD", accent: "#3B82F6" },
  "Closed Won":{ bg: "#052E16", text: "#86EFAC", accent: "#22C55E" },
};

const STAGE_ORDER = ["Prospect", "Proposal", "Negotiation", "Closed Won"];

const PRIORITY_COLORS = {
  High:   { bg: "rgba(239,68,68,0.1)", text: "#F87171", border: "rgba(239,68,68,0.2)" },
  Medium: { bg: "rgba(245,158,11,0.1)", text: "#FBBF24", border: "rgba(245,158,11,0.2)" },
  Low:    { bg: "rgba(34,197,94,0.1)", text: "#4ADE80", border: "rgba(34,197,94,0.2)" },
};

const STATUS_COLORS = {
  Open:          { bg: "rgba(239,68,68,0.1)", text: "#F87171" },
  "In Progress": { bg: "rgba(245,158,11,0.1)", text: "#FBBF24" },
  Closed:        { bg: "rgba(34,197,94,0.1)", text: "#4ADE80" },
};

const sectionVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: APPLE_EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: APPLE_EASE } },
};

export default function SalesforceDashboard({ lang }) {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [contacts, setContacts] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const isEn = lang === "en";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const sf = getSalesforceService(null, null);
      try {
        const [c, o, a, cs] = await Promise.all([
          sf.getContacts(),
          sf.getOpportunities(),
          sf.getAccounts(),
          sf.getCases(),
        ]);
        setContacts(c.records);
        setOpportunities(o.records);
        setAccounts(a.records);
        setCases(cs.records);
      } catch (e) {
        console.error("Salesforce load error:", e);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const pipelineByStage = useMemo(() => {
    const map = {};
    STAGE_ORDER.forEach(s => { map[s] = []; });
    opportunities.forEach(opp => {
      const stage = STAGE_ORDER.includes(opp.StageName) ? opp.StageName : "Prospect";
      map[stage].push(opp);
    });
    return map;
  }, [opportunities]);

  const totalPipeline = useMemo(
    () => opportunities.reduce((s, o) => s + (o.Amount || 0), 0),
    [opportunities]
  );

  const filteredContacts = useMemo(
    () => contacts.filter(c =>
      c.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.Account?.Name || "").toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [contacts, searchTerm]
  );

  const tabs = [
    { id: "pipeline",  label: T.sfPipeline[lang],  icon: "\u25C8" },
    { id: "contacts",  label: T.sfContacts[lang],   icon: "\u25CB" },
    { id: "accounts",  label: T.sfAccounts[lang],   icon: "\u25A3" },
    { id: "cases",     label: T.sfCases[lang],      icon: "\u25CE" },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)" }}>
          <div style={{ fontSize: 28, marginBottom: 12, animation: "bounce 1.5s ease-in-out infinite" }}>{"\u25C8"}</div>
          <p style={{ fontSize: 13, fontWeight: 600 }}>{isEn ? "Loading CRM data..." : "Cargando datos CRM..."}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: APPLE_EASE }}>
      {/* Sync Status Banner */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 18px", borderRadius: 16, marginBottom: 20,
        background: "rgba(99,102,241,0.06)",
        border: "1px solid rgba(99,102,241,0.15)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: "#F59E0B",
            display: "inline-block", boxShadow: "0 0 8px rgba(245,158,11,0.5)",
          }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#818CF8" }}>
            {T.sfDemoMode[lang]}
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            {isEn ? "Connect Salesforce credentials for live data" : "Conecta credenciales de Salesforce para datos en vivo"}
          </span>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
          background: "#6366F1", color: "#fff", letterSpacing: "0.05em",
        }}>SALESFORCE CRM</span>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: T.sfPipeline[lang], value: fmt(totalPipeline), color: "#6366F1", icon: "\u25C8" },
          { label: T.sfContacts[lang], value: contacts.length, color: "#3B82F6", icon: "\u25CB" },
          { label: T.sfAccounts[lang], value: accounts.length, color: "#8B5CF6", icon: "\u25A3" },
          { label: T.sfCases[lang], value: cases.length, color: "#EF4444", icon: "\u25CE" },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: APPLE_EASE }}
            whileHover={{ y: -3, boxShadow: `0 8px 30px ${kpi.color}15` }}
            style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "18px 20px",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {kpi.label}
              </span>
              <span style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${kpi.color}15`, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 14, color: kpi.color,
              }}>{kpi.icon}</span>
            </div>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#FAFAFA" }}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab Bar */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 20,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: 4, borderRadius: 16,
        backdropFilter: "blur(12px)",
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 12, border: "none",
              cursor: "pointer", fontSize: 12, fontWeight: 700,
              background: activeTab === tab.id ? "rgba(99,102,241,0.12)" : "transparent",
              color: activeTab === tab.id ? "#818CF8" : "rgba(255,255,255,0.4)",
              boxShadow: activeTab === tab.id ? "0 0 20px rgba(99,102,241,0.1)" : "none",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span style={{ marginRight: 6 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} variants={sectionVariants} initial="initial" animate="animate" exit="exit">
          {activeTab === "pipeline" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {STAGE_ORDER.map((stage, stageIdx) => {
                const stageOpps = pipelineByStage[stage] || [];
                const stageTotal = stageOpps.reduce((s, o) => s + (o.Amount || 0), 0);
                const colors = STAGE_COLORS[stage];
                return (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stageIdx * 0.08, duration: 0.5, ease: APPLE_EASE }}
                    style={{
                      background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)",
                      overflow: "hidden", backdropFilter: "blur(12px)",
                    }}
                  >
                    {/* Column Header */}
                    <div style={{
                      padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                      background: `${colors.accent}10`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#FAFAFA" }}>
                          {isEn ? stage : (
                            stage === "Prospect" ? "Prospecto" :
                            stage === "Proposal" ? "Propuesta" :
                            stage === "Negotiation" ? "Negociacion" :
                            "Cerrado Ganado"
                          )}
                        </span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px",
                          borderRadius: 8, background: colors.accent,
                          color: "#fff",
                        }}>{stageOpps.length}</span>
                      </div>
                      <p style={{ margin: "6px 0 0", fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
                        {fmt(stageTotal)}
                      </p>
                    </div>
                    {/* Cards */}
                    <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8, minHeight: 120 }}>
                      {stageOpps.length === 0 && (
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "20px 0" }}>
                          {isEn ? "No opportunities" : "Sin oportunidades"}
                        </p>
                      )}
                      {stageOpps.map((opp, oppIdx) => (
                        <motion.div
                          key={opp.Id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: stageIdx * 0.08 + oppIdx * 0.04, duration: 0.35, ease: APPLE_EASE }}
                          whileHover={{ y: -2, boxShadow: `0 4px 16px ${colors.accent}20` }}
                          style={{
                            padding: "12px 14px", borderRadius: 12,
                            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#FAFAFA", marginBottom: 6 }}>{opp.Name}</p>
                          <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{opp.Account?.Name}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: colors.accent }}>{fmt(opp.Amount)}</span>
                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{opp.CloseDate}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === "contacts" && (
            <div style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden", backdropFilter: "blur(12px)",
            }}>
              {/* Search Bar */}
              <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <input
                  type="text" value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder={isEn ? "Search contacts..." : "Buscar contactos..."}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "#FAFAFA",
                    fontFamily: "'DM Sans', sans-serif", background: "rgba(255,255,255,0.03)",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                  }}
                  onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
              {/* Contacts Table */}
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {[
                      isEn ? "Name" : "Nombre",
                      "Email",
                      isEn ? "Phone" : "Telefono",
                      isEn ? "Company" : "Empresa",
                    ].map((h, i) => (
                      <th key={i} style={{
                        padding: "12px 18px", textAlign: "left", fontSize: 10,
                        fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact, cIdx) => (
                    <motion.tr
                      key={contact.Id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: cIdx * 0.03, duration: 0.3, ease: APPLE_EASE }}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.3s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 800, color: "#fff",
                          }}>
                            {contact.Name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#FAFAFA" }}>{contact.Name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: 12, color: "#818CF8" }}>{contact.Email}</td>
                      <td style={{ padding: "14px 18px", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{contact.Phone}</td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "3px 10px",
                          borderRadius: 8, background: "rgba(99,102,241,0.1)", color: "#818CF8",
                        }}>{contact.Account?.Name}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "accounts" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {accounts.map((account, aIdx) => (
                <motion.div
                  key={account.Id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: aIdx * 0.06, duration: 0.5, ease: APPLE_EASE }}
                  whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(99,102,241,0.1)" }}
                  style={{
                    background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "22px 20px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 800, color: "#fff",
                      boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                    }}>
                      {account.Name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#FAFAFA" }}>{account.Name}</p>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
                        background: "rgba(34,197,94,0.1)", color: "#4ADE80",
                      }}>{account.Industry}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: isEn ? "City" : "Ciudad", value: account.BillingCity, icon: "\u25CB" },
                      { label: isEn ? "Phone" : "Telefono", value: account.Phone, icon: "\u25CE" },
                      { label: "Website", value: account.Website, icon: "\u25C8" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{item.icon}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", minWidth: 55 }}>{item.label}:</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "cases" && (
            <div style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden", backdropFilter: "blur(12px)",
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {[
                      isEn ? "Case #" : "Caso #",
                      isEn ? "Subject" : "Asunto",
                      isEn ? "Status" : "Estado",
                      isEn ? "Priority" : "Prioridad",
                      isEn ? "Contact" : "Contacto",
                    ].map((h, i) => (
                      <th key={i} style={{
                        padding: "12px 18px", textAlign: "left", fontSize: 10,
                        fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c, cIdx) => {
                    const prioColor = PRIORITY_COLORS[c.Priority] || PRIORITY_COLORS.Medium;
                    const statusColor = STATUS_COLORS[c.Status] || STATUS_COLORS.Open;
                    return (
                      <motion.tr
                        key={c.Id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: cIdx * 0.03, duration: 0.3, ease: APPLE_EASE }}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.3s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <td style={{ padding: "14px 18px", fontSize: 12, fontWeight: 700, color: "#818CF8", fontFamily: "'DM Mono', monospace" }}>
                          {c.CaseNumber}
                        </td>
                        <td style={{ padding: "14px 18px", fontSize: 12, fontWeight: 600, color: "#FAFAFA" }}>
                          {c.Subject}
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 8,
                            background: statusColor.bg, color: statusColor.text,
                          }}>{c.Status}</span>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 8,
                            background: prioColor.bg, color: prioColor.text,
                            border: `1px solid ${prioColor.border}`,
                          }}>{c.Priority}</span>
                        </td>
                        <td style={{ padding: "14px 18px", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                          {c.Contact?.Name}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
