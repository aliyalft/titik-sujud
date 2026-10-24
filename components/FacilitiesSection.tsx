"use client";

import { useState, useEffect, useRef } from "react";
import {
  TentTree,
  MapPin, // Menggantikan Accessibility
  Droplets,
  Clock3,
} from "lucide-react";

const facilities = [
  {
    icon: TentTree,
    title: "Musholla Portable",
    description:
      "Ruang ibadah yang dapat dihadirkan di lokasi kegiatan sesuai kebutuhan dan kondisi tempat.",
    label: "01",
  },
  {
    icon: MapPin, // Menggantikan Accessibility
    title: "Ruang yang Terjangkau",
    description:
      "Membantu peserta dan pengunjung menemukan ruang untuk beribadah di area acara.",
    label: "02",
  },
  {
    icon: Droplets,
    title: "Kebutuhan Bersuci",
    description:
      "Kebutuhan wudu dan fasilitas pendukung disesuaikan dengan skema layanan serta lokasi.",
    label: "03",
  },
  {
    icon: Clock3,
    title: "Dukungan Kegiatan",
    description:
      "Koordinasi penempatan dan kebutuhan unit dilakukan bersama penyelenggara acara.",
    label: "04",
  },
];

export default function FacilitiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play Carousel untuk tampilan Mobile
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % facilities.length;
        if (carouselRef.current) {
          const cardWidth = carouselRef.current.scrollWidth / facilities.length;
          carouselRef.current.scrollTo({
            left: cardWidth * nextIndex,
            behavior: "smooth",
          });
        }
        return nextIndex;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Handler saat user menggeser manual di HP
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.scrollWidth / facilities.length;
      const newIndex = Math.round(scrollPosition / cardWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < facilities.length) {
        setActiveIndex(newIndex);
      }
    }
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.scrollWidth / facilities.length;
      carouselRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="facilities-section section-pad" id="fasilitas">
      {/* Background Glow Ornament */}
      <div className="facilities-bg-glow" />

      <div className="page-container">
        <div className="section-topline">
          <span className="section-kicker">
            <span className="section-number">02</span>
            FASILITAS
          </span>

          <span className="section-side-note">
            Dirancang untuk kebutuhan kegiatan
          </span>
        </div>

        <div className="facilities-heading-row">
          <h2 className="section-heading">
            Ruang ibadah yang
            <br />
            hadir lebih <em>dekat.</em>
          </h2>

          <p className="body-copy facilities-intro">
            Setiap kegiatan memiliki kebutuhan yang berbeda.
            Mari sesuaikan kebutuhan fasilitas bersama tim Titik Sujud.
          </p>
        </div>

        {/* Carousel & Grid Container */}
        <div 
          className="facilities-carousel-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div
            className="facility-grid"
            ref={carouselRef}
            onScroll={handleScroll}
          >
            {facilities.map(({ icon: Icon, title, description, label }) => (
              <article className="facility-card" key={title}>
                <div className="facility-card-top">
                  <span className="facility-number">{label}</span>

                  <span className="facility-icon">
                    <Icon size={22} strokeWidth={1.8} />
                  </span>
                </div>

                <h3>{title}</h3>
                <p>{description}</p>
                <span className="facility-bottom-line" />
              </article>
            ))}
          </div>

          {/* Indikator Bulatan (Dots) Khusus Mobile */}
          <div className="facilities-dots">
            {facilities.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`dot-item ${activeIndex === idx ? "active" : ""}`}
                onClick={() => handleDotClick(idx)}
                aria-label={`Lihat fasilitas ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <p className="facility-footnote">
          Ketersediaan unit, fasilitas pendukung, dan kebutuhan teknis
          dikonfirmasi saat pengajuan berdasarkan lokasi serta jenis acara.
        </p>
      </div>
    </section>
  );
}