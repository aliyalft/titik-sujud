"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import "@/components/admin/admin.css";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  
  // Cek apakah halaman saat ini adalah halaman login
  const isLoginPage = pathname === "/admin/login";

  // Jika halaman login, render children saja TANPA sidebar dan TANPA admin-shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Untuk halaman admin lainnya (Dashboard, Jangkauan, dll), tampilkan dengan sidebar
  return (
    <main className="admin-shell">
      <AdminSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
    </main>
  );
}