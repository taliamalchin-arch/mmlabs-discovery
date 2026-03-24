import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MMLABS — Brand Discovery",
  description: "Brand identity discovery intake for MMLABS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
