import { ImageResponse } from "next/og";

// Raster logo for structured data (Google wants PNG/JPG, at least 112×112).
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffd000" }}>
        <div style={{ display: "flex", width: 400, height: 340, borderRadius: "50%", background: "#fff", border: "16px solid #0b0b0d", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", width: 290, height: 236, borderRadius: "50%", background: "#07132f", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", width: 226, height: 184, borderRadius: "50%", background: "linear-gradient(135deg, #5ff6ff, #168aff 45%, #8f4dff)", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", width: 128, height: 108, borderRadius: "50%", background: "#06112d" }} />
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
