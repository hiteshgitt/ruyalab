import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Message received",
  robots: { index: false, follow: false },
};

export default function Thanks() {
  return (
    <section className="container" style={{ paddingBlock: "8rem 6rem", maxWidth: "40rem" }}>
      <p className="label">
        <span className="paren">Contact</span>
      </p>
      <h1 className="display" style={{ fontSize: "var(--t-h1)", marginTop: "0.75rem" }}>
        Message received.
      </h1>
      <p style={{ marginTop: "1.25rem", maxWidth: "36rem", color: "var(--c-text-2)" }}>
        Thanks — your message is in. We'll be in touch soon.
      </p>
      <p style={{ marginTop: "2rem" }}>
        <a href="/" className="label">
          Back home
        </a>
      </p>
    </section>
  );
}
