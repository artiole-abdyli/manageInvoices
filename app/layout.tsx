"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "./context/AppContext";
import { I18nProvider } from "@/src/i18n/I18nProvider";
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
        <I18nProvider>
          <AuthProvider>
            {isAuthPage ? children : <Sidebar>{children}</Sidebar>}
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
