"use client";

import {
  MessageCircle,
  ClipboardList,
  CalendarDays,
  Handshake,
  CheckCircle2,
} from "lucide-react";

const WHATSAPP_URL = "https://wa.me/";

const steps = [
  {
    icon: ClipboardList,
    title: "Sampaikan Kebutuhan",
    description:
      "Isi pengajuan dengan informasi acara, lokasi, tanggal, dan kebutuhan unit.",
  },
  {
    icon: MessageCircle,
    title: "Koordinasi Bersama Tim",
    description:
      "Tim Titik Sujud meninjau pengajuan dan berkoordinasi mengenai teknis lapangan.",
  },
  {
    icon: CalendarDays,
    title: "Konfirmasi Pelaksanaan",
    description:
      "Penempatan unit, jadwal, dan skema layanan dikonfirmasi bersama penyelenggara.",
  },
];

export default function CollaborationSection() {
  return (
    <section className="collaboration-section section-pad" id="kolaborasi">
      <div className="page-container">
        <div className="collaboration-panel">
          {/* Sisi Kiri: Copywriting & CTA Utama */}
          <div className="collaboration-copy">
            <div className="collaboration-copy-inner">
              <div className="section-kicker section-kicker-light">
                <span className="section-number">03</span>
                <span>MARI BERKOLABORASI</span>
              </div>

              <h2 className="section-heading">
                Sebuah acara,
                <br />
                sebuah kesempatan
                <br />
                untuk <em>berbagi kebaikan.</em>
              </h2>

              <p className="collaboration-desc">
                Sedang menyiapkan festival, konser, kegiatan komunitas, pameran, atau acara publik lainnya? Ajukan kebutuhan musholla portable agar pengunjung tetap memiliki ruang untuk beribadah.
              </p>

              <a href="/pengajuan" className="button-collab-primary">
                <Handshake size={18} strokeWidth={2} />
                <span>Ajukan Kebutuhan</span>
              </a>
            </div>

            {/* Catatan Gratis di Bawah Kiri */}
            <div className="collab-badge-footnote">
              <CheckCircle2 size={16} className="text-accent" />
              <span>Layanan diberikan tanpa biaya (100% Gratis).</span>
            </div>
          </div>

          {/* Sisi Kanan: Step-by-Step Cards & FAQ Chat */}
          <div className="collaboration-details">
            <div className="details-header">
              <span className="details-subtitle">PROSES MUDAH & TRANSPARAN</span>
              <h3>Bagaimana Proses Kolaborasinya?</h3>
            </div>

            {/* List Langkah-Langkah (Tanpa Nomor) */}
            <div className="steps-timeline">
              {steps.map(({ icon: Icon, title, description }) => (
                <div className="step-card" key={title}>
                  <div className="step-icon-box">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <div className="step-card-body">
                    <h4>{title}</h4>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Box Diskusi WhatsApp */}
            <div className="collab-chat-box">
              <div className="chat-box-info">
                <div className="chat-icon-circle">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4>Ingin bertanya dahulu?</h4>
                  <p>Hubungi tim melalui WhatsApp untuk diskusi singkat sebelum mengajukan.</p>
                </div>
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="chat-wa-btn"
              >
                <span>Hubungi Tim</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}