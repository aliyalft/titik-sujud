
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, MapPin, Menu, X } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isDashboard = pathname === "/admin/dashboard";
  const isJangkauan = pathname === "/admin/jangkauan";

  async function logout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-mobile-header">
        <Link
          className="admin-brand"
          href="/admin/dashboard"
          onClick={() => setMenuOpen(false)}
        >
          <span className="admin-brand-icon">
            <Image
              src="/images/logo.png"
              alt="Logo Titik Sujud"
              width={45}
              height={45}
              priority
            />
          </span>
          <span>
            <strong>Titik Sujud</strong>
            <small>ADMIN PANEL</small>
          </span>
        </Link>

        <button
          type="button"
          className="admin-mobile-toggle"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav className={`admin-desktop-menu ${menuOpen ? "is-open" : ""}`}>
        <p className="sidebar-label">MENU UTAMA</p>

        <Link
          className={`sidebar-link ${isDashboard ? "active" : ""}`}
          href="/admin/dashboard"
          aria-current={isDashboard ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          className={`sidebar-link ${isJangkauan ? "active" : ""}`}
          href="/admin/jangkauan"
          aria-current={isJangkauan ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          <MapPin size={18} />
          Jangkauan Layanan
        </Link>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-logout"
            onClick={logout}
            disabled={loggingOut}
          >
            <LogOut size={17} />
            {loggingOut ? "Keluar..." : "Keluar"}
          </button>
        </div>
      </nav>
    </aside>
  );
}
