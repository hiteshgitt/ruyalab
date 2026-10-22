import { ImageResponse } from "next/og";

export const alt = "Ruyalab — We turn ambitious ideas into digital reality.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetch Anton from Google Fonts so the card matches the site's display face.
async function anton(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Anton&text=RUYALABWETNMBISDGOC.", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" },
    }).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const font = await anton();
  const display = font ? "Anton" : "sans-serif";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f3f2ee", padding: 48, fontFamily: display }}>
        <div style={{ display: "flex", fontSize: 250, lineHeight: 0.8, color: "#0b0b0d", letterSpacing: -2 }}>RUYALAB</div>
        <div
          style={{
            display: "flex",
            flex: 1,
            marginTop: 24,
            borderRadius: 36,
            background: "#ffd000",
            padding: "40px 48px",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", fontSize: 64, lineHeight: 0.95, color: "#0b0b0d" }}>
            <span>WE TURN AMBITIOUS IDEAS</span>
            <span style={{ color: "#2f45ff" }}>INTO DIGITAL REALITY.</span>
          </div>
          {/* Vision-eye mark */}
          <div style={{ display: "flex", width: 150, height: 130, borderRadius: "50%", background: "#fff", border: "6px solid #0b0b0d", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", width: 104, height: 86, borderRadius: "50%", background: "#07132f", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", width: 80, height: 66, borderRadius: "50%", background: "linear-gradient(135deg, #5ff6ff, #168aff 45%, #8f4dff)", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", width: 44, height: 38, borderRadius: "50%", background: "#06112d" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Anton", data: font, style: "normal", weight: 400 }] : undefined },
  );
}
