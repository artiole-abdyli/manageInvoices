"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "./context/AppContext";
import Sidebar from "@/src/components/sidebar/Sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = ["/login", "/register"].includes(pathname);

  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden">
        <AuthProvider>
          {isAuthPage ? children : <Sidebar>{children}</Sidebar>}
        </AuthProvider>
      </body>
    </html>
  );
}
