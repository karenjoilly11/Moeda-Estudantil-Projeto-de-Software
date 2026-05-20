import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || "Erro desconhecido" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary capturou:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "2rem",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#1e293b" }}>
            Algo deu errado
          </h1>
          <p style={{ color: "#64748b", marginBottom: "1rem", fontSize: "0.95rem" }}>
            Ocorreu um erro inesperado ao renderizar a tela. Tente recarregar a página.
          </p>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.8rem",
              fontFamily: "monospace",
              marginBottom: "1.5rem",
              wordBreak: "break-word",
            }}
          >
            {this.state.message}
          </p>
          <button
            onClick={this.handleReload}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "0.6rem 1.2rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}
