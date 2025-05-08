// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "./context/AppContext";
import Sidebar from "@/src/components/sidebar/Sidebar"; // ✅ use this, not SiderLayout

export const metadata: Metadata = {
  title: "Chique dolls exclusive",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* ✅ enable flex layout across screen */}
      <body className="flex h-screen overflow-hidden">
        {/* ✅ Sidebar always visible */}
        <Sidebar children={children} />

        {/* ✅ Wrap only the main content in AuthProvider */}
      </body>
    </html>
  );
}
