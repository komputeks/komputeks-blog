import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Komputeks Blog",
  description: "Modern full-stack technology blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
