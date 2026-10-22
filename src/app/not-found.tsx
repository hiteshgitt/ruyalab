import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/mascot/Mascot";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section
      className="container"
      style={{ minHeight: "88svh", display: "grid", alignContent: "center", justifyItems: "center", gap: "var(--s-5)", paddingTop: "var(--nav-h)", textAlign: "center" }}
    >
      <Mascot pose="discover" decorative priority className="nf-mascot" />
      <p className="label">
        <span className="paren accent">404</span> + Not found
      </p>
      <h1 className="display" style={{ fontSize: "var(--t-h1)", maxWidth: "12ch" }}>
        We looked <span className="blue">everywhere.</span>
      </h1>
      <p style={{ color: "var(--c-text-2)", maxWidth: "26rem" }}>
        This page hasn&apos;t taken shape yet — or it moved. Let&apos;s get you back on track.
      </p>
      <Button href="/" arrow>
        Back to the studio
      </Button>
    </section>
  );
}
