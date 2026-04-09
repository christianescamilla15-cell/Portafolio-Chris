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

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const lang = this.props.lang || "es";
      const title = lang === "es" ? "Algo salio mal" : "Something went wrong";
      const message = lang === "es"
        ? "Ha ocurrido un error inesperado en esta seccion. Puedes intentar de nuevo."
        : "An unexpected error occurred in this section. You can try again.";
      const btnText = lang === "es" ? "Reintentar" : "Retry";

      return (
        <div
          role="alert"
          style={{
            background: "#0A0B0F",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 12,
            padding: "24px 20px",
            textAlign: "center",
            margin: "8px 0",
          }}
        >
          <p style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#F87171",
            margin: "0 0 8px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {title}
          </p>
          <p style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.45)",
            margin: "0 0 16px",
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {message}
          </p>
          <button
            onClick={this.handleRetry}
            aria-label={btnText}
            style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, #6366F1, #4F46E5)",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "opacity 0.2s",
            }}
          >
            {btnText}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
