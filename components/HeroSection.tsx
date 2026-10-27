
"use client";

import { useState, useRef } from "react";
import { HeartHandshake, Play, Pause } from "lucide-react";

export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlayVideo = async () => {
    const video = videoRef.current;

    if (!video) return;

    if (!video.paused) {
      video.pause();
      return;
    }

    try {
      await video.play();
    } catch (error) {
      console.error("Video gagal diputar:", error);
    }
  };

  return (
    <section className="hero-section" id="beranda">
      <div className="hero-overlay" />

      <div className="hero-container">
        {/* Teks Kiri */}
        <div className="hero-text-content">
          <div className="hero-pill-tag">
            <span className="pill-dot" />
            <span className="pill-text">
              TITIK SUJUD · MUSHOLLA PORTABLE
            </span>
          </div>

          <h1 className="hero-title">
            Di Mana Ada Kegiatan, <br />
            <span className="accent">Di Sana Ada</span> Ruang Sujud.
          </h1>

          <p className="hero-description">
            Menghadirkan fasilitas musholla portable secara gratis untuk
            berbagai kegiatan dan acara publik, agar setiap orang tetap
            nyaman beribadah di tengah kesibukan.
          </p>

          <div className="hero-cta-group">
            <a href="/pengajuan" className="btn-primary">
              <HeartHandshake size={18} />
              <span>Ajukan Kolaborasi</span>
            </a>

            <a href="#tentang" className="btn-secondary">
              <span>Kenali Titik Sujud</span>
            </a>
          </div>
        </div>

        {/* Video Hero */}
        <div className="hero-visual-container">
          <div className="hero-arch-card">
            <div className="hero-arch-media-wrapper">
              
<video
  ref={videoRef}
  preload="auto"
  playsInline
  onLoadedData={(event) => {
    const video = event.currentTarget;
    video.pause();
    video.currentTime = 0;
  }}
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
  onEnded={() => setIsPlaying(false)}
>
  <source src="/video/video.mp4" type="video/mp4" />
  Browser Anda tidak mendukung pemutar video.
</video>


              <button
                type="button"
                className={`corner-play-button ${
                  isPlaying ? "is-playing" : ""
                }`}
                onClick={handlePlayVideo}
                aria-label={isPlaying ? "Jeda video" : "Putar video"}
              >
                <div className="corner-play-icon">
                  {isPlaying ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} style={{ marginLeft: "2px" }} />
                  )}
                </div>

                <span>
                  {isPlaying ? "Jeda" : "Tonton Video"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
