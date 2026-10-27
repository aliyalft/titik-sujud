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
  
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <main className="admin-shell">
      <AdminSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
    </main>
  );
}