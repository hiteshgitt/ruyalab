import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RuyaShield",
  robots: { index: false, follow: false, nocache: true },
};

export default function RuyaShieldLayout({ children }: { children: React.ReactNode }) {
  return children;
}
