import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const APPLE_EASE = [0.16, 1, 0.3, 1];

export default function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.4, ease: APPLE_EASE }}
          style={{
            position: "fixed", top: 24, right: 24,
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "12px 24px",
            color: "#4ADE80", fontSize: 13, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            pointerEvents: "none", zIndex: 999,
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
