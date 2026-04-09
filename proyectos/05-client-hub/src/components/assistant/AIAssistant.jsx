import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { T } from "../../constants/translations.js";
import { chatWithToolUse, getDemoAssistantResponse, getSuggestionChips } from "../../services/api.js";

const APPLE_EASE = [0.16, 1, 0.3, 1];

export default function AIAssistant({ onClose, projects, invoices, tickets, documents, recentActions, lang, apiKey, sendRef }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: T.aiWelcome[lang],
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const send = async (overrideInput) => {
    const msgText = overrideInput || input;
    if (!msgText.trim() || loading) return;
    const userMsg = { role: "user", content: msgText };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    let response = null;
    let isAI = false;
    if (apiKey) {
      response = await chatWithToolUse(msgText, projects, invoices, tickets, documents, lang, apiKey);
      if (response) isAI = true;
    }
    if (!response) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
      response = getDemoAssistantResponse(msgText, projects, invoices, tickets, documents, recentActions, lang);
    }
    setMessages(prev => [...prev, { role: "assistant", content: response, isAI }]);
    setLoading(false);
  };

  useEffect(() => {
    if (sendRef) sendRef.current = send;
  }, [sendRef, send]);

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: T.chatCleared[lang],
    }]);
    setInput("");
  };

  const showChips = messages.length <= 2 && !loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.35, ease: APPLE_EASE }}
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 1000,
        width: 380, background: "rgba(15,15,20,0.95)",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }}
      role="dialog"
      aria-label={T.aiTitle[lang]}
    >
      <div style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&#10022;</div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>{T.aiTitle[lang]}</p>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{T.aiPowered[lang]}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {messages.length > 1 && (
            <button onClick={clearChat} title={T.cleanChat[lang]}
              aria-label={T.cleanChat[lang]}
              style={{
                background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6,
                width: 26, height: 26, cursor: "pointer", color: "#fff", fontSize: 11,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
            >
              &#8634;
            </button>
          )}
          <button onClick={onClose}
            aria-label={lang === "es" ? "Cerrar asistente" : "Close assistant"}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, width: 26, height: 26, cursor: "pointer", color: "#fff", fontSize: 14, transition: "background 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
          >
            &#10005;
          </button>
        </div>
      </div>
      <div ref={chatContainerRef} aria-live="polite" style={{ height: 280, overflowY: "auto", padding: "14px 16px" }}>
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: APPLE_EASE }}
              style={{ marginBottom: 10, display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 8 }}
            >
              <div style={{
                maxWidth: "82%", padding: "9px 13px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: m.role === "user" ? "#6366F1" : "rgba(255,255,255,0.04)",
                border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.06)",
                fontSize: 12, lineHeight: 1.65,
                color: m.role === "user" ? "#fff" : "rgba(255,255,255,0.7)",
                overflowWrap: "break-word", wordBreak: "break-word",
                maxHeight: 200, overflowY: "auto", whiteSpace: "pre-line",
              }}>
                {m.content}
                {m.role === "assistant" && m.isAI !== undefined && (
                  <span style={{
                    display: "inline-block", marginTop: 4, fontSize: 9, fontWeight: 800,
                    padding: "1px 6px", borderRadius: 4,
                    background: m.isAI ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
                    color: m.isAI ? "#4ADE80" : "rgba(255,255,255,0.3)",
                    letterSpacing: "0.05em",
                  }}>{m.isAI ? T.aiBadge[lang] : T.demoBadge[lang]}</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: APPLE_EASE }}
            style={{ marginBottom: 10, display: "flex", gap: 8 }}
          >
            <div style={{
              maxWidth: "82%", padding: "9px 13px", borderRadius: "14px 14px 14px 4px",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
              fontSize: 12, color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 6,
            }}>
              <span>{T.typing[lang]}</span>
              <span style={{ display: "flex", gap: 3 }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366F1", display: "inline-block", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
              </span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion chips */}
      {showChips && (
        <div style={{ padding: "0 14px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {getSuggestionChips(lang).map((chip, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: APPLE_EASE }}
              onClick={() => send(chip)}
              aria-label={chip}
              style={{
                padding: "5px 11px", borderRadius: 20,
                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                fontSize: 11, color: "#818CF8", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
            >
              {chip}
            </motion.button>
          ))}
        </div>
      )}

      <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
          placeholder={T.chatPlaceholder[lang]}
          aria-label={T.chatPlaceholder[lang]}
          style={{
            flex: 1, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
            padding: "8px 12px", fontSize: 12, color: "#FAFAFA",
            fontFamily: "'DM Sans', sans-serif",
            background: "rgba(255,255,255,0.03)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
          onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading}
          aria-label={lang === "es" ? "Enviar mensaje" : "Send message"}
          style={{
            background: input.trim() && !loading ? "#6366F1" : "rgba(255,255,255,0.06)",
            border: "none", borderRadius: 8, width: 34, height: 34,
            cursor: input.trim() && !loading ? "pointer" : "default",
            color: input.trim() && !loading ? "#fff" : "rgba(255,255,255,0.2)",
            fontSize: 14, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: input.trim() && !loading ? "0 2px 8px rgba(99,102,241,0.3)" : "none",
          }}>&#8593;</button>
      </div>
    </motion.div>
  );
}
