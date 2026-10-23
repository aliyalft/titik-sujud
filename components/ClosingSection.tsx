"use client";

import { HeartHandshake, MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/";

export default function ClosingSection() {
  return (
    <section className="closing-section">
      <div className="page-container closing-content">
        <div className="closing-badge">
          <HeartHandshake size={15} className="closing-badge-icon" />
          <span>MARI HADIRKAN RUANG UNTUK BERSUJUD</span>
        </div>

        <h2>
          Sebarkan kebaikan,
          <br />
          hadirkan <em>ruang ibadah.</em>
        </h2>

        <p className="closing-description">
          Bersama Titik Sujud, mari bantu menghadirkan fasilitas ibadah
          yang nyaman dan bersih di berbagai kegiatan serta ruang publik.
        </p>

        <div className="closing-actions">
          <a className="button button-primary" href="#kolaborasi">
            <HeartHandshake size={17} strokeWidth={1.8} />
            <span>Ajukan Kolaborasi</span>
          </a>

          <a
            className="button button-secondary-action"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} />
            <span>Hubungi Tim</span>
          </a>
        </div>
      </div>
    </section>
  );
}