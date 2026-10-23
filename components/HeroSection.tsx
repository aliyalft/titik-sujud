"use client";

import { useState, useRef } from "react";
import { HeartHandshake, ArrowRight, Play, Pause } from "lucide-react";


export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
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
            <span className="pill-text">TITIK SUJUD · MUSHOLLA PORTABLE</span>
          </div>

          <h1 className="hero-title">
            Di Mana Ada Kegiatan, <br />
            <span className="accent">Di Sana Ada</span> Ruang Sujud.
          </h1>

          <p className="hero-description">
            Menghadirkan fasilitas musholla portable secara gratis untuk berbagai
            kegiatan dan acara publik, agar setiap orang tetap nyaman beribadah di tengah kesibukan.
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

        {/* Frame Arch Kubah untuk Video */}
        <div className="hero-visual-container">
          <div className="hero-arch-card">
            <div className="hero-arch-media-wrapper">
              <video
                ref={videoRef}
                preload="none"
                poster="/images/hero-titik-sujud.jpg"
                playsInline
                onEnded={() => setIsPlaying(false)}
              >
                <source src="/videos/titik-sujud-intro.mp4" type="video/mp4" />
                Browser Anda tidak mendukung pemutar video.
              </video>

              {/* Tombol Play Melayang di Pojok Bawah Frame */}
              <button
                type="button"
                className={`corner-play-button ${isPlaying ? "is-playing" : ""}`}
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
                <span>{isPlaying ? "Jeda" : "Tonton Video"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}