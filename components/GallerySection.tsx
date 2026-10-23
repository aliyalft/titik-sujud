
"use client";

import { useEffect, useState } from "react";
import { X, MapPin } from "lucide-react";
import InstagramIcon from "./InstagramIcon";

const INSTAGRAM_URL = "https://www.instagram.com/";

const gallery = [
  {
    image: "/images/dokumentasi/makassar-1.jpg",
    location: "Makassar",
    title: "Ruang Ibadah di Tengah Kegiatan",
    size: "gallery-large",
  },
  {
    image: "/images/dokumentasi/bandung-1.jpg",
    location: "Bandung",
    title: "Hadir untuk Pengunjung",
    size: "",
  },
  {
    image: "/images/dokumentasi/medan-1.jpg",
    location: "Medan",
    title: "Mendekatkan Ruang Sujud",
    size: "",
  },
];

export default function GallerySection() {
  const [activePhoto, setActivePhoto] = useState<
    (typeof gallery)[number] | null
  >(null);

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
    <section
      className="gallery-section section-pad"
      id="dokumentasi"
    >
      <div className="page-container">
        <div className="section-topline">
          <span className="section-kicker">
            <span className="section-number">04</span>
            JEJAK KEBAIKAN
          </span>

          <a
            href={INSTAGRAM_URL}
            className="text-link gallery-instagram"
            target="_blank"
            rel="noreferrer"
          >
            <InstagramIcon size={16} />
            Ikuti perjalanan kami
          </a>
        </div>

        <div className="gallery-heading-row">
          <h2 className="section-heading">
            Kebaikan yang
            <br />
            <em>telah dihadirkan.</em>
          </h2>

          <p className="body-copy">
            Setiap lokasi menyimpan cerita tentang ruang ibadah
            yang hadir di tengah aktivitas dan kebersamaan.
          </p>
        </div>

        <div className="gallery-grid">
          {gallery.map((photo) => (
            <button
              type="button"
              key={photo.location}
              className={`gallery-card ${photo.size}`}
              onClick={() => setActivePhoto(photo)}
              aria-label={`Perbesar foto ${photo.location}`}
            >
              <span
                className="gallery-card-image"
                style={{ backgroundImage: `url("${photo.image}")` }}
              />

              <span className="gallery-card-shade" />

              <span className="gallery-card-content">
                <span className="gallery-location">
                  <MapPin size={13} />
                  {photo.location}
                </span>

                <span className="gallery-title">{photo.title}</span>
              </span>
            </button>
          ))}
        </div>

        <p className="gallery-note">
          Dokumentasi pelaksanaan Titik Sujud. Foto akan disesuaikan
          dengan dokumentasi resmi setiap lokasi.
        </p>
      </div>

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
            <X size={23} />
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
