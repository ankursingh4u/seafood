import { ImageResponse } from "next/og";

export const size        = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0d1f2d",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Orange glow ring */}
        <div
          style={{
            position: "absolute",
            inset: 1,
            borderRadius: 6,
            border: "1.5px solid rgba(245,158,11,0.5)",
          }}
        />
        {/* "S" letter */}
        <span
          style={{
            color: "#f59e0b",
            fontSize: 18,
            fontWeight: 900,
            fontFamily: "serif",
            lineHeight: 1,
          }}
        >
          S
        </span>
      </div>
    ),
    { ...size }
  );
}
