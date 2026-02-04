import React, { useMemo, useRef, useState } from "react";

function isHttpsUrl(url = "") {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

export default function URLViewer({ data }) {
  const { url, title, description, canEmbed, hostname } = data;

  const httpsOk = useMemo(() => isHttpsUrl(url), [url]);

  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(Boolean(canEmbed));

  const showIframe = canEmbed && url && httpsOk;

  return (
    <div
      style={{
        background: "white",
        border: "2px solid #e0e0e0",
        borderRadius: 12,
        padding: 20,
        maxWidth: 600,
        margin: "8px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 32 }}>🌐</span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: 18, color: "#333", fontWeight: 600, margin: 0 }}>
            {title}
          </h3>
          {hostname && <div style={{ fontSize: 12, color: "#777" }}>{hostname}</div>}
        </div>
      </div>

      {description && (
        <p style={{ color: "#666", fontSize: 14, marginBottom: 12, lineHeight: 1.5 }}>
          {description}
        </p>
      )}

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            color: "#667eea",
            textDecoration: "none",
            fontSize: 14,
            padding: "8px 16px",
            background: "#f5f5ff",
            borderRadius: 8,
            wordBreak: "break-all",
          }}
        >
          Open link
        </a>

        {!httpsOk && (
          <span style={{ fontSize: 12, color: "#b45309" }}>
            Embedding blocked: URL must be HTTPS.
          </span>
        )}
      </div>

      {showIframe && (
        <div
          style={{
            marginTop: 16,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #e0e0e0",
            position: "relative",
            height: 400,
            background: "#fafafa",
          }}
        >
          {/* Loading overlay */}
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                fontSize: 13,
                color: "#666",
                zIndex: 2,
                background: "rgba(250,250,250,0.85)",
              }}
            >
              Loading preview…
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={url}
            title={title || "Embedded content"}
            style={{ width: "100%", height: "100%", border: "none" }}
            // You can loosen/tighten this based on your needs.
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
            onLoad={() => {
              // onLoad fires even if blocked, but we can at least stop the spinner
              setLoading(false);
            }}
          />
        </div>
      )}

      {canEmbed && (!url || !httpsOk) && (
        <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
          Preview not available — open the link instead.
        </div>
      )}
    </div>
  );
}
