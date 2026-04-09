import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const lang = this.props.lang || "es";
      return (
        <div style={{
          padding: 40, textAlign: "center", fontFamily: "'DM Sans', sans-serif",
          background: "#0A0B0F", borderRadius: 14, margin: 16,
        }}>
          <h2 style={{ color: "#F87171", fontSize: 18, fontWeight: 700 }}>
            {lang === "es" ? "Algo salio mal" : "Something went wrong"}
          </h2>
          <p style={{ color: "#94A3B8", fontSize: 13 }}>
            {this.state.error?.message || (lang === "es" ? "Error desconocido" : "Unknown error")}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            aria-label={lang === "es" ? "Reintentar" : "Retry"}
            style={{
              marginTop: 16, padding: "8px 20px", background: "#6366F1",
              color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
              fontSize: 13, fontWeight: 600,
            }}
          >
            {lang === "es" ? "Reintentar" : "Retry"}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
