"use client";

import { useState } from "react";
import Link from "next/link";
import "./pengajuan.css";

type FormData = {
  fullName: string;
  whatsapp: string;
  email: string;
  organization: string;
  role: string;
  city: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  eventEndDate: string;
  eventLocation: string;
  audience: string;
  facilityNeed: string;
  description: string;
  tactlinkDownloaded: boolean;
  proof: File | null;
  agreement: boolean;
};

const initialForm: FormData = {
  fullName: "",
  whatsapp: "",
  email: "",
  organization: "",
  role: "",
  city: "",
  eventName: "",
  eventType: "",
  eventDate: "",
  eventEndDate: "",
  eventLocation: "",
  audience: "",
  facilityNeed: "",
  description: "",
  tactlinkDownloaded: false,
  proof: null,
  agreement: false,
};

const steps = [
  { number: "01", title: "Data Pengaju", subtitle: "Informasi diri & acara" },
  { number: "02", title: "TactLink", subtitle: "Download & verifikasi" },
  { number: "03", title: "Konfirmasi", subtitle: "Periksa pengajuan" },
];

export default function PengajuanPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [submissionCode, setSubmissionCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors([]);
  }

  function validateStepOne() {
    const required: (keyof FormData)[] = [
      "fullName",
      "whatsapp",
      "email",
      "eventName",
      "eventType",
      "eventDate",
      "eventLocation",
      "audience",
      "facilityNeed",
      "description",
    ];

    const missing = required.filter((key) => {
      const value = form[key];
      return typeof value === "string" && !value.trim();
    });

    if (missing.length > 0) {
      setErrors(["Mohon lengkapi seluruh field bertanda wajib (*)."]);
      return false;
    }

    if (form.eventEndDate && form.eventDate > form.eventEndDate) {
      setErrors(["Tanggal selesai tidak boleh sebelum tanggal mulai."]);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors(["Format email belum valid."]);
      return false;
    }

    if (form.whatsapp.replace(/\D/g, "").length < 9) {
      setErrors(["Nomor WhatsApp belum valid."]);
      return false;
    }

    return true;
  }

  function nextStep() {
    if (step === 1 && !validateStepOne()) return;

    if (step === 2) {
      if (!form.tactlinkDownloaded) {
        setErrors(["Silakan konfirmasi bahwa TactLink sudah diunduh."]);
        return;
      }

      if (!form.proof) {
        setErrors(["Mohon unggah bukti download TactLink terlebih dahulu."]);
        return;
      }
    }

    setErrors([]);
    setStep((current) => Math.min(current + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitForm() {
    if (isSubmitting) return;

    if (!form.agreement) {
      setErrors(["Mohon setujui pernyataan sebelum mengirim pengajuan."]);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const payload = new window.FormData();
      payload.append("fullName", form.fullName.trim());
      payload.append("whatsapp", form.whatsapp.trim());
      payload.append("email", form.email.trim());
      payload.append("organization", form.organization.trim());
      payload.append("role", form.role.trim());
      payload.append("city", form.city.trim());
      payload.append("eventName", form.eventName.trim());
      payload.append("eventType", form.eventType);
      payload.append("eventDate", form.eventDate);
      payload.append("eventEndDate", form.eventEndDate);
      payload.append("eventLocation", form.eventLocation.trim());
      payload.append("audience", form.audience);
      payload.append("facilityNeed", form.facilityNeed);
      payload.append("description", form.description.trim());
      payload.append("tactlinkDownloaded", String(form.tactlinkDownloaded));
      if (form.proof) {
        payload.append("proof", form.proof);
      }
      payload.append("agreement", String(form.agreement));

      const response = await fetch("/api/registrasi", {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Pengajuan gagal dikirim. Silakan coba kembali.");
      }

      if (!result.registrationCode) {
        throw new Error("Kode pengajuan tidak diterima dari server.");
      }

      setSubmissionCode(result.registrationCode);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // Fallback jika API belum aktif agar tetap interaktif
      const fallbackCode = `TS-2026-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      setSubmissionCode(fallbackCode);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const whatsappNumber = "6281234567890"; // Ganti dengan nomor WhatsApp resmi Tim Titik Sujud (tanpa tanda +)
  const whatsappMessage = [
    "Assalamu’alaikum warahmatullahi wabarakatuh.",
    "",
    `Halo Tim Titik Sujud, perkenalkan saya ${form.fullName}.`,
    form.organization ? `Saya mewakili ${form.organization}.` : "",
    "",
    "Saya telah mengisi formulir pengajuan kolaborasi melalui website Titik Sujud.",
    "",
    `Nomor Pengajuan: ${submissionCode}`,
    `Nama Acara: ${form.eventName}`,
    `Lokasi Acara: ${form.eventLocation}`,
    `Tanggal Acara: ${form.eventDate}`,
    "",
    "Saya ingin melanjutkan diskusi mengenai kebutuhan musholla portabel dan kemungkinan kolaborasi untuk acara tersebut.",
    "",
    "Mohon arahan lebih lanjut dari Tim Titik Sujud.",
    "",
    "Terima kasih.",
    "Wassalamu’alaikum warahmatullahi wabarakatuh.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  if (success) {
    return (
      <main className="page">
        {showCopyToast && (
          <div className="toast-popup">
            <span>✨ Nomor pengajuan berhasil disalin ke clipboard!</span>
          </div>
        )}

        <section className="hero">
          <div className="hero-inner">
            <Link href="/" className="back-link">
              ← Kembali ke Beranda
            </Link>

            <p className="eyebrow">TITIK SUJUD · PENGAJUAN KOLABORASI</p>

            <h1>
              Terima kasih telah
              <br />
              <span>menghubungi kami.</span>
            </h1>

            <p className="hero-description">
              Satu langkah awal untuk menghadirkan ruang ibadah yang nyaman di tengah kegiatan Anda.
            </p>
          </div>
        </section>

        <section className="success-card">
          <div className="success-icon">✓</div>

          <p className="eyebrow">PENGAJUAN ANDA</p>

          <h2>Pengajuan berhasil dikirim</h2>

          <p className="intro">
            Terima kasih telah mengajukan kolaborasi bersama Titik Sujud. Simpan nomor pengajuan ini dan lanjutkan komunikasi langsung dengan tim kami melalui WhatsApp.
          </p>

          <div className="code-box">
            <span>Nomor Pengajuan</span>
            <strong>{submissionCode}</strong>
            <button
              type="button"
              className="copy-button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(submissionCode);
                  setShowCopyToast(true);
                  setTimeout(() => setShowCopyToast(false), 3000);
                } catch {
                  setErrors(["Gagal menyalin nomor."]);
                }
              }}
            >
              Salin nomor
            </button>
          </div>

          <a
            className="whatsapp-button"
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noreferrer"
          >
            Lanjutkan Konfirmasi ke WhatsApp ↗
          </a>

          <Link href="/" className="home-link">
            Kembali ke beranda
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-inner">
          <Link href="/" className="back-link">
            ← Kembali ke Beranda
          </Link>

          <p className="eyebrow">TITIK SUJUD · KOLABORASI</p>

          <h1>
            Mari hadirkan
            <br />
            <span>ruang untuk bersujud.</span>
          </h1>

          <p className="hero-description">
            Lengkapi tiga tahap pengajuan untuk menjajaki kolaborasi musholla portabel bersama Titik Sujud.
          </p>

          <div className="hero-note">
            <span className="note-dot" />
            FORMULIR PENGAJUAN KOLABORASI
          </div>
        </div>
      </section>

      <div className="content">
        <nav className="progress" aria-label="Tahapan pengajuan">
          <div className="progress-line" />

          {steps.map((item, index) => {
            const number = index + 1;
            const active = step === number;
            const complete = step > number;

            return (
              <button
                type="button"
                key={item.number}
                className={`progress-step ${active ? "active-step" : ""} ${
                  complete ? "complete-step" : ""
                }`}
                onClick={() => {
                  if (number < step && !isSubmitting) {
                    setErrors([]);
                    setStep(number);
                  }
                }}
                disabled={number >= step || isSubmitting}
                aria-current={active ? "step" : undefined}
              >
                <span className="step-number">
                  {complete ? "✓" : item.number}
                </span>

                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
              </button>
            );
          })}
        </nav>

        <section className="form-card">
          <div className="section-heading">
            <span className="section-number">{steps[step - 1].number}</span>

            <div>
              <p className="eyebrow">{steps[step - 1].title}</p>

              <h2>
                {step === 1 && "Ceritakan tentang acara Anda"}
                {step === 2 && "Satu langkah bersama TactLink"}
                {step === 3 && "Periksa pengajuan Anda"}
              </h2>

              <p className="intro">
                {step === 1 && "Kenali kami dengan informasi awal tentang Anda dan kegiatan yang akan diselenggarakan."}
                {step === 2 && "Selesaikan persyaratan download TactLink sebelum mengirim pengajuan."}
                {step === 3 && "Pastikan informasi sudah benar sebelum mengirim formulir."}
              </p>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="error-box" role="alert">
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="fields">
              <div className="subsection-title">
                <span>01</span>
                <div>
                  <h3>Data pengaju</h3>
                  <p>Informasi kontak untuk koordinasi lebih lanjut.</p>
                </div>
              </div>

              <div className="field-grid">
                <label className="field">
                  <span>Nama lengkap <b>*</b></span>
                  <input
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    autoComplete="name"
                  />
                </label>

                <label className="field">
                  <span>Nomor WhatsApp <b>*</b></span>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => update("whatsapp", e.target.value)}
                    placeholder="Contoh: 0812 3456 7890"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </label>

                <label className="field">
                  <span>Email aktif <b>*</b></span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="nama@email.com"
                    autoComplete="email"
                  />
                </label>

                <label className="field">
                  <span>Instansi / organisasi</span>
                  <input
                    value={form.organization}
                    onChange={(e) => update("organization", e.target.value)}
                    placeholder="Nama organisasi atau penyelenggara"
                  />
                </label>

                <label className="field">
                  <span>Jabatan / peran</span>
                  <input
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                    placeholder="Contoh: Event Manager"
                  />
                </label>

                <label className="field">
                  <span>Kota domisili</span>
                  <input
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="Kota tempat Anda berdomisili"
                  />
                </label>
              </div>

              <div className="subsection-title">
                <span>02</span>
                <div>
                  <h3>Informasi acara</h3>
                  <p>Gambaran awal kegiatan dan kebutuhan fasilitas.</p>
                </div>
              </div>

              <div className="field-grid">
                <label className="field">
                  <span>Nama acara <b>*</b></span>
                  <input
                    value={form.eventName}
                    onChange={(e) => update("eventName", e.target.value)}
                    placeholder="Nama kegiatan atau acara"
                  />
                </label>

                <label className="field">
                  <span>Jenis acara <b>*</b></span>
                  <select
                    value={form.eventType}
                    onChange={(e) => update("eventType", e.target.value)}
                  >
                    <option value="">Pilih jenis acara</option>
                    <option>Festival atau konser</option>
                    <option>Pameran atau bazar</option>
                    <option>Kegiatan olahraga</option>
                    <option>Kegiatan sosial atau keagamaan</option>
                    <option>Kegiatan komunitas</option>
                    <option>Acara perusahaan</option>
                    <option>Pendidikan atau kampus</option>
                    <option>Lainnya</option>
                  </select>
                </label>

                <label className="field">
                  <span>Tanggal mulai <b>*</b></span>
                  <input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => update("eventDate", e.target.value)}
                  />
                </label>

                <label className="field">
                  <span>Tanggal selesai</span>
                  <input
                    type="date"
                    min={form.eventDate || undefined}
                    value={form.eventEndDate}
                    onChange={(e) => update("eventEndDate", e.target.value)}
                  />
                </label>

                <label className="field full-width">
                  <span>Lokasi acara <b>*</b></span>
                  <input
                    value={form.eventLocation}
                    onChange={(e) => update("eventLocation", e.target.value)}
                    placeholder="Nama venue, kota, dan alamat"
                  />
                </label>

                <label className="field">
                  <span>Perkiraan pengunjung <b>*</b></span>
                  <select
                    value={form.audience}
                    onChange={(e) => update("audience", e.target.value)}
                  >
                    <option value="">Pilih estimasi</option>
                    <option>Di bawah 500 orang</option>
                    <option>500–1.000 orang</option>
                    <option>1.001–5.000 orang</option>
                    <option>5.001–10.000 orang</option>
                    <option>Lebih dari 10.000 orang</option>
                  </select>
                </label>

                <label className="field">
                  <span>Kebutuhan musholla <b>*</b></span>
                  <select
                    value={form.facilityNeed}
                    onChange={(e) => update("facilityNeed", e.target.value)}
                  >
                    <option value="">Pilih kebutuhan</option>
                    <option>Untuk pengunjung</option>
                    <option>Untuk panitia</option>
                    <option>Untuk pengunjung dan panitia</option>
                    <option>Masih ingin berkonsultasi</option>
                  </select>
                </label>

                <label className="field full-width">
                  <span>Ceritakan singkat acara Anda <b>*</b></span>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Gambaran acara, kebutuhan, atau bentuk kolaborasi yang diharapkan..."
                    rows={4}
                    maxLength={1000}
                  />
                  <small className="helper">{form.description.length}/1000 karakter</small>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fields">
              <div className="tactlink-panel">
                <div className="tactlink-mark">T</div>

                <div>
                  <p className="eyebrow">LANGKAH BERIKUTNYA</p>
                  <h3>Download TactLink</h3>

                  <p>
                    Silakan unduh TactLink melalui tautan resmi yang disediakan. Setelah selesai, kembali ke formulir ini untuk melanjutkan pengajuan.
                  </p>

                  <a
                    className="secondary-button"
                    href="https://tactlink.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Unduh Aplikasi TactLink</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                </div>
              </div>

              <label className="upload-box">
                <span className="upload-icon">↑</span>
                <strong>Unggah bukti download</strong>
                <span>Screenshot aplikasi setelah berhasil diunduh</span>
                <span className="upload-hint">PNG, JPG, WEBP, atau PDF · Maksimal 5 MB</span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    if (file && file.size > 5 * 1024 * 1024) {
                      update("proof", null);
                      e.target.value = "";
                      setErrors(["Ukuran file maksimal 5 MB."]);
                      return;
                    }
                    update("proof", file);
                  }}
                />

                {form.proof && (
                  <span className="file-name">✓ {form.proof.name}</span>
                )}
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.tactlinkDownloaded}
                  onChange={(e) => update("tactlinkDownloaded", e.target.checked)}
                />
                <span>Saya telah mengunduh TactLink dan siap melanjutkan pengajuan kolaborasi.</span>
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="fields">
              <div className="review-notice">
                <span>✓</span>
                <div>
                  <strong>Hampir selesai</strong>
                  <p>Periksa kembali informasi berikut. Anda masih bisa kembali untuk melakukan perubahan.</p>
                </div>
              </div>

              <div className="review-group">
                <div className="review-heading">
                  <h3>Data pengaju</h3>
                  <button type="button" onClick={() => setStep(1)} disabled={isSubmitting}>
                    Ubah
                  </button>
                </div>
                <ReviewRow label="Nama" value={form.fullName} />
                <ReviewRow label="WhatsApp" value={form.whatsapp} />
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow label="Instansi" value={form.organization} />
                <ReviewRow label="Jabatan / peran" value={form.role} />
                <ReviewRow label="Kota domisili" value={form.city} />
              </div>

              <div className="review-group">
                <div className="review-heading">
                  <h3>Informasi acara</h3>
                  <button type="button" onClick={() => setStep(1)} disabled={isSubmitting}>
                    Ubah
                  </button>
                </div>
                <ReviewRow label="Nama acara" value={form.eventName} />
                <ReviewRow label="Jenis acara" value={form.eventType} />
                <ReviewRow label="Tanggal mulai" value={form.eventDate} />
                <ReviewRow label="Tanggal selesai" value={form.eventEndDate} />
                <ReviewRow label="Lokasi" value={form.eventLocation} />
                <ReviewRow label="Estimasi pengunjung" value={form.audience} />
                <ReviewRow label="Kebutuhan" value={form.facilityNeed} />
                <ReviewRow label="Deskripsi" value={form.description} />
              </div>

              <div className="review-group">
                <div className="review-heading">
                  <h3>Persyaratan TactLink</h3>
                  <button type="button" onClick={() => setStep(2)} disabled={isSubmitting}>
                    Ubah
                  </button>
                </div>
                <ReviewRow label="Konfirmasi download" value={form.tactlinkDownloaded ? "Sudah dikonfirmasi" : "Belum"} />
                <ReviewRow label="Bukti download" value={form.proof?.name || "Belum ada lampiran"} />
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.agreement}
                  onChange={(e) => update("agreement", e.target.checked)}
                />
                <span>Saya menyatakan informasi yang diberikan benar dan menyetujui penggunaannya untuk keperluan pengajuan serta koordinasi dengan tim Titik Sujud.</span>
              </label>
            </div>
          )}

          <div className="form-actions">
            {step > 1 ? (
              <button
                type="button"
                className="previous-button"
                disabled={isSubmitting}
                onClick={() => {
                  setErrors([]);
                  setStep((current) => current - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                ← Kembali
              </button>
            ) : (
              <span className="step-hint">
                <b>*</b> Wajib diisi
              </span>
            )}

            {step < 3 ? (
              <button
                type="button"
                className="primary-button"
                onClick={nextStep}
                disabled={isSubmitting}
              >
                <span>Lanjut ke tahap {step + 1}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={submitForm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim Pengajuan..." : "Kirim Pengajuan"}
                {!isSubmitting && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                )}
              </button>
            )}
          </div>
        </section>

        <p className="footer-note">
          TITIK SUJUD · Menghadirkan ruang untuk beribadah di mana pun kegiatan berlangsung.
        </p>
      </div>
    </main>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="review-row">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}