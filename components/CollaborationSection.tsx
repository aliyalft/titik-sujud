
import {
  MessageCircle,
  ClipboardList,
  CalendarDays,
  Handshake,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Sampaikan Kebutuhan",
    description:
      "Isi pengajuan dengan informasi acara, lokasi, tanggal, dan kebutuhan musholla.",
  },
  {
    icon: MessageCircle,
    title: "Koordinasi Bersama Tim",
    description:
      "Tim Titik Sujud meninjau pengajuan dan berkoordinasi mengenai kebutuhan teknis.",
  },
  {
    icon: CalendarDays,
    title: "Konfirmasi Pelaksanaan",
    description:
      "Ketersediaan unit, jadwal, dan penempatan dikonfirmasi bersama penyelenggara.",
  },
];

export default function CollaborationSection() {
  return (
    <section
      className="collaboration-section section-pad"
      id="kolaborasi"
    >
      <div className="page-container">
        <div className="collaboration-panel">
          <div className="collaboration-copy">
            <span className="section-kicker section-kicker-light">
              <span className="section-number">03</span>
              MARI BERKOLABORASI
            </span>

            <h2 className="section-heading">
              Sebuah acara,
              <br />
              sebuah kesempatan
              <br />
              untuk <em>berbagi kebaikan.</em>
            </h2>

            <p>
              Sedang menyiapkan festival, konser, kegiatan komunitas,
              pameran, atau acara publik lainnya? Ajukan kebutuhan
              musholla portable agar pengunjung tetap memiliki ruang
              untuk beribadah.
            </p>

            <a
              href="/pengajuan"
              className="button button-light"
            >
              <Handshake size={17} strokeWidth={1.8} />
              Ajukan Kebutuhan
            </a>
          </div>

          <div className="collaboration-details">
            <div className="collaboration-detail">
              <span className="detail-icon">
                <CheckCircle2 size={21} strokeWidth={1.7} />
              </span>

              <div>
                <h3>Bagaimana prosesnya?</h3>

                <ul>
                  {steps.map(({ title, description }) => (
                    <li key={title}>
                      <strong>{title}.</strong> {description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="collaboration-divider" />

            <div className="collaboration-detail">
              <span className="detail-icon">
                <MessageCircle size={21} strokeWidth={1.7} />
              </span>

              <div>
                <h3>Ingin bertanya dahulu?</h3>

                <p className="body-copy">
                  Hubungi tim melalui WhatsApp untuk berdiskusi
                  mengenai kebutuhan acara sebelum mengajukan.
                </p>
              </div>
            </div>

            <p className="collaboration-note">
              <CheckCircle2 size={15} />
              <span>
                Layanan diberikan tanpa biaya. Pengajuan tetap melalui
                proses koordinasi dan konfirmasi ketersediaan.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
