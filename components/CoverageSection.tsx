"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  CheckCircle2,
  CalendarDays,
  Compass,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Area = {
  id: string;
  city_name: string;
  area_status: "active" | "upcoming";
  sort_order: number;
};

export default function CoverageSection() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  const runningRef = useRef<HTMLDivElement>(null);
  const upcomingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;

    fetch("/api/service-areas", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Gagal memuat jangkauan.");
        return response.json();
      })
      .then((result) => {
        if (alive) setAreas(result.areas ?? []);
      })
      .catch((error) => {
        console.error("Jangkauan layanan:", error);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const runningLocations = areas
    .filter((area) => area.area_status === "active")
    .sort((a, b) => a.sort_order - b.sort_order);

  const upcomingLocations = areas
    .filter((area) => area.area_status === "upcoming")
    .sort((a, b) => a.sort_order - b.sort_order);

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

          {/* List Wilayah Kanan (Dinamis dari Database Admin) */}
          <div className="coverage-list">
            
            {/* Group Sudah Berjalan (Active) */}
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
                  {loading ? (
                    <span className="service-city-empty" style={{ padding: "10px", fontSize: "13px" }}>Memuat wilayah...</span>
                  ) : runningLocations.length > 0 ? (
                    runningLocations.map((loc) => (
                      <span className="location-pill pill-running" key={loc.id}>
                        <MapPin size={13} />
                        {loc.city_name}
                      </span>
                    ))
                  ) : (
                    <span className="service-city-empty" style={{ padding: "10px", fontSize: "13px" }}>Belum ada wilayah aktif.</span>
                  )}
                </div>
              </div>
            </article>

            {/* Group Jangkauan Mendatang (Upcoming) */}
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
                  {loading ? (
                    <span className="service-city-empty" style={{ padding: "10px", fontSize: "13px" }}>Memuat wilayah...</span>
                  ) : upcomingLocations.length > 0 ? (
                    upcomingLocations.map((loc) => (
                      <span className="location-pill pill-upcoming" key={loc.id}>
                        <MapPin size={13} />
                        {loc.city_name}
                      </span>
                    ))
                  ) : (
                    <span className="service-city-empty" style={{ padding: "10px", fontSize: "13px" }}>Belum ada wilayah mendatang.</span>
                  )}
                </div>
              </div>
            </article>

          </div>
        </div>
      </div>
    </section>
  );
}