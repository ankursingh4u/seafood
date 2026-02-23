import { ImageResponse } from "next/og";

export const size        = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#0d1f2d",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 4,
          position: "relative",
        }}
      >
        {/* Orange border ring */}
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: 32,
            border: "3px solid rgba(245,158,11,0.45)",
          }}
        />
        {/* "S" */}
        <span
          style={{
            color: "#f59e0b",
            fontSize: 90,
            fontWeight: 900,
            fontFamily: "serif",
            lineHeight: 1,
          }}
        >
          S
        </span>
        {/* Tagline */}
        <span
          style={{
            color: "rgba(245,158,11,0.55)",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          SEAFOOD
        </span>
      </div>
    ),
    { ...size }
  );
}
