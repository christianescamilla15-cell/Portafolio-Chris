import { motion } from "framer-motion";

const APPLE_EASE = [0.16, 1, 0.3, 1];

export default function Modal({ children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      }} onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.35, ease: APPLE_EASE }}
        onClick={e => e.stopPropagation()} role="dialog" aria-modal="true"
        style={{
          background: "rgba(20,20,25,0.95)", borderRadius: 20, padding: 28,
          width: 440, border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          backdropFilter: "blur(20px)",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
