"use client";

import { useRef } from "react";
import {
  MapPin,
  CheckCircle2,
  CalendarDays,
  Compass,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const runningLocations = ["Makassar", "Bandung", "Medan", "Samarinda"];
const upcomingLocations = [
  "Barru",
  "Wajo",
  "Palembang",
  "Maluku Utara",
  "Aceh",
];

export default function CoverageSection() {
  const runningRef = useRef<HTMLDivElement>(null);
  const upcomingRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="coverage-section section-pad" id="jangkauan">
      <div className="coverage-bg-pattern" />
      <div className="coverage-arch-ornament" />

      <div className="coverage-mobile-lock">
        <div className="page-container coverage-grid">
          {/* Copy Deskripsi Kiri */}
          <div className="coverage-copy">
            <div className="section-kicker">
              <span className="section-number">05</span>
              <span>JANGKAUAN LAYANAN</span>
            </div>

            <h2 className="section-heading">
              Melangkah lebih jauh,
              <br />
              menghadirkan <em>kebaikan.</em>
            </h2>

            <p className="body-copy">
              Titik Sujud telah hadir di sejumlah wilayah dan terus mempersiapkan
              jangkauan berikutnya. Setiap pengajuan akan ditinjau berdasarkan
              lokasi, jadwal, dan ketersediaan unit.
            </p>

            <div className="coverage-info-badge">
              <Compass size={16} className="badge-compass-icon" />
              <span>Siap melayani pengajuan di seluruh wilayah Indonesia</span>
            </div>
          </div>

          {/* List Wilayah Kanan */}
          <div className="coverage-list">

<article className="coverage-group coverage-group-running">
  <div className="coverage-group-heading">
    <div className="coverage-heading-main">
      <div className="coverage-status-icon icon-running">
        <CheckCircle2 size={21} />
      </div>

      <div className="coverage-heading-text">
        <h3>Sudah Berjalan</h3>
        <p>Wilayah aktif pelaksanaan musholla portable</p>
      </div>
    </div>

    {/* Tombol Panah Navigasi */}
    <div className="scroll-controls">
      <button
        type="button"
        onClick={() => scroll(runningRef, "left")}
        aria-label="Geser Kiri"
        className="scroll-btn"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        onClick={() => scroll(runningRef, "right")}
        aria-label="Geser Kanan"
        className="scroll-btn"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  </div>

  <div className="location-pills-wrapper" ref={runningRef}>
    <div className="location-pills">
      {runningLocations.map((location) => (
        <span className="location-pill pill-running" key={location}>
          <MapPin size={13} />
          {location}
        </span>
      ))}
    </div>
  </div>
</article>


<article className="coverage-group coverage-group-upcoming">
  <div className="coverage-group-heading">
    <div className="coverage-heading-main">
      <div className="coverage-status-icon icon-upcoming">
        <CalendarDays size={21} />
      </div>

      <div className="coverage-heading-text">
        <h3>Jangkauan Mendatang</h3>
        <p>Wilayah yang sedang dalam persiapan unit</p>
      </div>
    </div>

    {/* Tombol Panah Navigasi */}
    <div className="scroll-controls">
      <button
        type="button"
        onClick={() => scroll(upcomingRef, "left")}
        aria-label="Geser Kiri"
        className="scroll-btn"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        onClick={() => scroll(upcomingRef, "right")}
        aria-label="Geser Kanan"
        className="scroll-btn"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  </div>

  <div className="location-pills-wrapper" ref={upcomingRef}>
    <div className="location-pills">
      {upcomingLocations.map((location) => (
        <span className="location-pill pill-upcoming" key={location}>
          <MapPin size={13} />
          {location}
        </span>
      ))}
    </div>
  </div>
</article>
          </div>
        </div>
      </div>
    </section>
  );
}