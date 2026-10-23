
import {
  TentTree,
  Accessibility,
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
    icon: Accessibility,
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
  return (
    <section className="facilities-section section-pad" id="fasilitas">
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

        <div className="facility-grid">
          {facilities.map(({ icon: Icon, title, description, label }) => (
            <article className="facility-card" key={title}>
              <div className="facility-card-top">
                <span className="facility-number">{label}</span>

                <span className="facility-icon">
                  <Icon size={24} strokeWidth={1.6} />
                </span>
              </div>

              <h3>{title}</h3>
              <p>{description}</p>
              <span className="facility-bottom-line" />
            </article>
          ))}
        </div>

        <p className="facility-footnote">
          Ketersediaan unit, fasilitas pendukung, dan kebutuhan teknis
          dikonfirmasi saat pengajuan berdasarkan lokasi serta jenis acara.
        </p>
      </div>
    </section>
  );
}
