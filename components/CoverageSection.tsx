
import { MapPin, CheckCircle2, CalendarDays } from "lucide-react";

const runningLocations = [
  "Makassar",
  "Bandung",
  "Medan",
  "Samarinda",
];

const upcomingLocations = [
  "Barru",
  "Wajo",
  "Palembang",
  "Maluku Utara",
  "Aceh",
];

export default function CoverageSection() {
  return (
    <section
      className="coverage-section section-pad"
      id="jangkauan"
    >
      <div className="page-container coverage-grid">
        <div className="coverage-copy">
          <span className="section-kicker">
            <span className="section-number">05</span>
            JANGKAUAN LAYANAN
          </span>

          <h2 className="section-heading">
            Melangkah lebih jauh,
            <br />
            menghadirkan <em>kebaikan.</em>
          </h2>

          <p className="body-copy">
            Titik Sujud telah hadir di sejumlah wilayah dan terus
            mempersiapkan jangkauan berikutnya. Setiap pengajuan
            akan ditinjau berdasarkan lokasi, jadwal, dan ketersediaan.
          </p>

          <div className="coverage-legend">
            <span className="legend-item">
              <span className="legend-dot legend-running" />
              Sudah berjalan
            </span>

            <span className="legend-item">
              <span className="legend-dot legend-upcoming" />
              Akan datang
            </span>
          </div>
        </div>

        <div className="coverage-list">
          <article className="coverage-group">
            <div className="coverage-group-heading">
              <span className="coverage-status-icon">
                <CheckCircle2 size={21} />
              </span>

              <div>
                <h3>Sudah Berjalan</h3>
                <p>Wilayah pelaksanaan</p>
              </div>

              <span className="coverage-count">
                {String(runningLocations.length).padStart(2, "0")}
              </span>
            </div>

            <div className="location-pills">
              {runningLocations.map((location) => (
                <span className="location-pill" key={location}>
                  <MapPin size={13} />
                  {location}
                </span>
              ))}
            </div>
          </article>

          <article className="coverage-group">
            <div className="coverage-group-heading">
              <span className="coverage-status-icon upcoming-icon">
                <CalendarDays size={21} />
              </span>

              <div>
                <h3>Jangkauan Mendatang</h3>
                <p>Wilayah yang sedang dipersiapkan</p>
              </div>

              <span className="coverage-count">
                {String(upcomingLocations.length).padStart(2, "0")}
              </span>
            </div>

            <div className="location-pills">
              {upcomingLocations.map((location) => (
                <span
                  className="location-pill upcoming-pill"
                  key={location}
                >
                  <MapPin size={13} />
                  {location}
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
