"use client";

import { useEffect, useState, useRef } from "react";
import { X, MapPin } from "lucide-react";
import InstagramIcon from "./InstagramIcon";

const INSTAGRAM_URL = "https://www.instagram.com/";

const gallery = [
  {
    image: "./images/foto3.png",
    location: "Makassar",
    title: "Ruang Ibadah di Tengah Kegiatan",
  },
  {
    image: "./images/foto1.png",
    location: "Bandung",
    title: "Hadir untuk Pengunjung",
  },
  {
    image: "./images/foto2.png",
    location: "Medan",
    title: "Mendekatkan Ruang Sujud",
  },
];

export default function GallerySection() {
  const [activePhoto, setActivePhoto] = useState<
    (typeof gallery)[number] | null
  >(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Auto-play cepat dan responsif
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % gallery.length;
        if (carouselRef.current) {
          const cardWidth = carouselRef.current.scrollWidth / gallery.length;
          carouselRef.current.scrollTo({
            left: cardWidth * next,
            behavior: "smooth",
          });
        }
        return next;
      });
    }, 2000); // Dipercepat menjadi 2 detik per slide

    return () => clearInterval(interval);
  }, []);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.scrollWidth / gallery.length;
      const newIndex = Math.round(scrollPosition / cardWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < gallery.length) {
        setActiveIndex(newIndex);
      }
    }
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.scrollWidth / gallery.length;
      carouselRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!activePhoto) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActivePhoto(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activePhoto]);

  return (
    <section className="gallery-section section-pad" id="dokumentasi">
      <div className="gallery-bg-glow" />

      <div className="page-container">
        <div className="section-topline">
          <span className="section-kicker">
            <span className="section-number">04</span>
            JEJAK KEBAIKAN
          </span>

          <a
            href={INSTAGRAM_URL}
            className="gallery-instagram"
            target="_blank"
            rel="noreferrer"
          >
            <InstagramIcon size={16} />
            <span>Instagram</span>
          </a>
        </div>

        <div className="gallery-heading-row">
          <h2 className="section-heading">
            Kebaikan yang
            <br />
            <em>telah dihadirkan.</em>
          </h2>

          <p className="body-copy gallery-intro">
            Setiap lokasi menyimpan cerita tentang ruang ibadah
            yang hadir di tengah aktivitas dan kebersamaan.
          </p>
        </div>

        {/* Carousel Runner Wrapper */}
        <div className="gallery-carousel-wrapper">
          <div
            className="gallery-grid"
            ref={carouselRef}
            onScroll={handleScroll}
          >
            {gallery.map((photo) => (
              <button
                type="button"
                key={photo.location}
                className="gallery-card"
                onClick={() => setActivePhoto(photo)}
                aria-label={`Perbesar foto ${photo.location}`}
              >
                <div className="gallery-arch-frame">
                  <span
                    className="gallery-card-image"
                    style={{ backgroundImage: `url("${photo.image}")` }}
                  />
                  <span className="gallery-card-shade" />

                  <span className="gallery-card-content">
                    <span className="gallery-location">
                      <MapPin size={12} />
                      {photo.location}
                    </span>

                    <span className="gallery-title">{photo.title}</span>
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Dots Pagination */}
          <div className="gallery-dots">
            {gallery.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`dot-item ${activeIndex === idx ? "active" : ""}`}
                onClick={() => handleDotClick(idx)}
                aria-label={`Lihat foto ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <p className="gallery-note">
          Dokumentasi pelaksanaan Titik Sujud. Foto akan disesuaikan
          dengan dokumentasi resmi setiap lokasi.
        </p>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Dokumentasi ${activePhoto.location}`}
          onClick={() => setActivePhoto(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setActivePhoto(null)}
            aria-label="Tutup foto"
          >
            <X size={22} />
          </button>

          <div
            className="lightbox-image"
            role="img"
            aria-label={activePhoto.title}
            style={{
              backgroundImage: `url("${activePhoto.image}")`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="lightbox-caption">
              <span>{activePhoto.location}</span>
              <h3>{activePhoto.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}