import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Compute Intelligence Platform",
  description: "Strategic intelligence for the next era of compute infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
