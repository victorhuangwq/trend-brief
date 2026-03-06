import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trend Brief — Powered by Exa",
  description:
    "Discover what's trending and why. Semantic search for consumer insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
