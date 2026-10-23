
import { Heart, HandHeart, Users } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Berangkat dari Kepedulian",
    description:
      "Membantu menghadirkan ruang ibadah di tengah aktivitas masyarakat.",
  },
  {
    icon: HandHeart,
    title: "Layanan Tanpa Biaya",
    description:
      "Musholla dihadirkan secara gratis sesuai skema dan ketersediaan layanan.",
  },
  {
    icon: Users,
    title: "Terbuka untuk Kolaborasi",
    description:
      "Bersinergi dengan penyelenggara acara dan berbagai pihak yang ingin menghadirkan fasilitas ibadah.",
  },
];

export default function AboutSection() {
  return (
    <section className="intro-section section-pad" id="tentang">
      <div className="page-container">
        <div className="intro-grid">
          <div className="intro-label">
            <span className="section-kicker">
              <span className="section-number">01</span>
              TENTANG KAMI
            </span>
          </div>

          <div className="intro-copy">
            <h2 className="section-heading">
              Karena setiap
              <br />
              perjalanan layak
              <br />
              memiliki <em>ruang sujud.</em>
            </h2>

            <p className="intro-lead">
              Ibadah seharusnya tetap memiliki tempat, di mana pun
              aktivitas membawa kita.
            </p>

            <p className="body-copy">
              Titik Sujud menghadirkan musholla portable untuk berbagai
              acara dan ruang publik. Kami ingin membantu penyelenggara
              kegiatan menyediakan ruang beribadah yang lebih mudah
              dijangkau oleh peserta, pengunjung, dan masyarakat.
            </p>

            <a href="#kolaborasi" className="text-link">
              Kenali cara berkolaborasi
            </a>
          </div>

          <div className="intro-visual">
            <div className="intro-photo" role="img" aria-label="Dokumentasi musholla portable Titik Sujud" />

            <div className="intro-caption">
              <span className="caption-mark">“</span>
              <p>
                Memberi ruang bagi setiap langkah untuk kembali
                mengingat-Nya.
              </p>
              <span className="caption-tag">NILAI TITIK SUJUD</span>
            </div>
          </div>
        </div>

        <div className="about-values">
          {values.map(({ icon: Icon, title, description }) => (
            <article className="about-value-card" key={title}>
              <span className="about-value-icon">
                <Icon size={22} strokeWidth={1.7} />
              </span>

              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
