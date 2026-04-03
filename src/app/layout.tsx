'use client';

import { Inter } from "next/font/google";
import "../styles/globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body className={inter.className}>
        {isLoginPage ? (
          <main>{children}</main>
        ) : (
          <div className="layout-wrapper">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
