"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import InstagramIcon from "./InstagramIcon";

const INSTAGRAM_URL = "https://www.instagram.com/titiksujud_/";

const navigation = [
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Fasilitas", href: "#fasilitas" },
  { label: "Kolaborasi", href: "#kolaborasi" },
  { label: "Dokumentasi", href: "#dokumentasi" },
  { label: "Jangkauan", href: "#jangkauan" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div 
        className="nav-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Logo (Kiri) */}
        <a
          className="brand"
          href="#beranda"
          aria-label="Titik Sujud - Beranda"
          onClick={closeMenu}
        >
          <span className="brand-symbol" aria-hidden="true">
            <img
              src="/images/logo.png"
              alt=""
              className="brand-logo"
            />
          </span>

          <span className="brand-copy">
            <span className="brand-name">Titik Sujud</span>
            <span className="brand-tag">RUANG UNTUK BERSUJUD</span>
          </span>
        </a>

        {/* Tombol Toggle Menu Mobile */}
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        {/* Menu Navigasi Utama (Di Tengah secara Desktop) */}
        <nav
          className={`nav-links ${menuOpen ? "nav-open" : ""}`}
          aria-label="Navigasi utama"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            margin: "0 auto", // Kunci agar menu berada di tengah area header
          }}
        >
          {navigation.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}

          <a
            className="nav-instagram"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram Titik Sujud"
            onClick={closeMenu}
          >
            <InstagramIcon size={16} />
            <span>Instagram</span>
          </a>

          {/* Tombol Ajukan Kolaborasi (Paling Kanan / Ikut di menu mobile) */}
          <a
            href="/pengajuan"
            className="button button-primary nav-cta"
            style={{ textDecoration: "none" }}
            onClick={closeMenu}
          >
            Ajukan Kolaborasi
          </a>
        </nav>
      </div>
    </header>
  );
}