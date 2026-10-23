"use client";

import InstagramIcon from "./InstagramIcon";
import { Mail, MapPin, MessageSquare } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/";
const WHATSAPP_URL = "https://wa.me/";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        {/* Grid Utama Footer */}
        <div className="footer-grid">
          {/* Kolom 1: Brand & Deskripsi */}
          <div className="footer-col footer-col-brand">
            <a className="brand footer-brand" href="#beranda">
              <span className="brand-symbol">
                <img src="/images/logo.png" alt="Logo Titik Sujud" className="brand-logo" />
              </span>
              <span className="brand-copy">
                <span className="brand-name">Titik Sujud</span>
                <span className="brand-tag">RUANG UNTUK BERSUJUD</span>
              </span>
            </a>

            <p className="footer-about">
              Fasilitas musholla portable gratis untuk mendukung kenyamanan ibadah di berbagai kegiatan publik, komunitas, dan acara besar Anda.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigasi</h4>
            <ul className="footer-links-list">
              <li><a href="#beranda">Beranda</a></li>
              <li><a href="#tentang">Tentang Kami</a></li>
              <li><a href="#layanan">Fasilitas</a></li>
              <li><a href="#kolaborasi">Ajukan Kolaborasi</a></li>
            </ul>
          </div>

          {/* Kolom 3: Informasi & Kontak */}
          <div className="footer-col">
            <h4 className="footer-heading">Layanan & Kontak</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={16} className="contact-icon" />
                <span>Jabodetabek & Sekitarnya</span>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <span>kontak@titiksujud.id</span>
              </li>
              <li>
                <MessageSquare size={16} className="contact-icon" />
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  Layanan WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Komunitas & Media Sosial */}
          <div className="footer-col">
            <h4 className="footer-heading">Ikuti Kami</h4>
            <p className="footer-social-text">
              Pantau dokumentasi kegiatan dan kabar kolaborasi terbaru di Instagram kami.
            </p>
            <div className="footer-social-group">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="social-button"
                aria-label="Instagram Titik Sujud"
              >
                <InstagramIcon size={18} />
                <span>@titiksujud.id</span>
              </a>
            </div>
          </div>
        </div>

        {/* Baris Bawah / Copyright */}
        <div className="footer-bottom">
          <span>&copy; 2026 Titik Sujud. Hak Cipta Dilindungi.</span>
          <span>Menghadirkan ruang ibadah, menebarkan kebaikan.</span>
        </div>
      </div>
    </footer>
  );
}