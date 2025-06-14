import "./globals.css";
import React from "react";

export const metadata = {
  title: "Todo App",
  description: "Simple todo built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
