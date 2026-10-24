"use client";

import { HeartHandshake, MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/";

export default function ClosingSection() {
  return (
    <section className="closing-section register-v2-heading-panel">
      {/* SILUET MASJID CSS UTUH MILIK KAMU */}
      <div className="heading-mosque-bg" aria-hidden="true">
        {/* Menara Kiri */}
        <div className="mosque-minaret" />

        {/* Kubah Samping Kiri */}
        <div className="mosque-dome mosque-dome-left" />

        {/* Bangunan Utama Masjid & Kubah Tengah */}
        <div className="mosque-main">
          
          <div className="mosque-main-dome" />
          <div className="mosque-main-body" />
        </div>

        {/* Kubah Samping Kanan */}
        <div className="mosque-dome mosque-dome-right" />

        {/* Menara Kanan */}
        <div className="mosque-minaret" />
      </div>

      {/* KONTEN UTAMA */}
      <div className="page-container closing-content register-v2-heading-inner">
        

        <h2>
          Sebarkan kebaikan,
          <br />
          hadirkan <em>ruang ibadah.</em>
        </h2>

        <p className="closing-description">
          Bersama Titik Sujud, mari bantu menghadirkan fasilitas ibadah
          yang nyaman, bersih, dan memadai di berbagai kegiatan serta ruang publik.
        </p>

        <div className="closing-actions">
          <a className="button button-primary" href="#kolaborasi">
            <HeartHandshake size={18} strokeWidth={2} />
            <span>Ajukan Kolaborasi</span>
          </a>

          <a
            className="button button-secondary-action"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            <span>Hubungi Tim</span>
          </a>
        </div>
      </div>
    </section>
  );
}