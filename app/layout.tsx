import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "./context/AppContext";
import Sidebar from "@/src/components/sidebar/Sidebar";

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
      <body className="flex h-screen overflow-hidden">
        <Sidebar children={children} />
      </body>
    </html>
  );
}
