"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowDownToLine,
  CheckCircle2,
  Clock3,
  FileText,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";

type Registration = {
  id: string;
  registration_code: string;
  full_name: string;
  whatsapp: string;
  email: string | null;
  city: string | null;
  organization: string | null;
  role: string | null;
  event_name: string | null;
  event_type: string | null;
  event_date: string | null;
  event_end_date: string | null;
  event_location: string | null;
  audience: string | null;
  facility_need: string | null;
  description: string | null;
  tactlink_downloaded: boolean;
  download_proof_path: string | null;
  additional_proof_path: string | null;
  proof_path: string | null;
  agreement: boolean;
  status: "pending" | "verified" | "rejected";
  created_at: string;
};

const statusLabels = {
  pending: "Menunggu",
  verified: "Terverifikasi",
  rejected: "Ditolak",
};

const dateFormat = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "—";

export default function AdminDashboard() {
  const router = useRouter();
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [busyId, setBusyId] = useState("");

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/registrations", {
        cache: "no-store",
      });

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal memuat pengajuan.");
      }

      setRows(result.registrations ?? []);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const filteredRows = rows.filter((row) => {
    const text = [
      row.full_name,
      row.registration_code,
      row.event_name,
      row.whatsapp,
      row.organization,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      text.includes(query.toLowerCase()) &&
      (statusFilter === "all" || row.status === statusFilter)
    );
  });

  const counts = {
    all: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    verified: rows.filter((r) => r.status === "verified").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
  };

  async function updateStatus(
    row: Registration,
    status: Registration["status"]
  ) {
    if (
      status === "rejected" &&
      !window.confirm(`Tolak pengajuan ${row.full_name}?`)
    ) {
      return;
    }

    setBusyId(row.id);
    setError("");

    try {
      const response = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal memperbarui status.");
      }

      await loadRows();

      setSelected((current) =>
        current?.id === row.id ? { ...current, status } : current
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memperbarui.");
    } finally {
      setBusyId("");
    }
  }

  async function deleteRegistration(row: Registration) {
    if (
      !window.confirm(
        `Hapus pengajuan ${row.full_name} (${row.registration_code})? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      return;
    }

    setBusyId(row.id);
    setError("");

    try {
      const response = await fetch("/api/admin/registrations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus pengajuan.");
      }

      setSelected(null);
      await loadRows();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
      setBusyId("");
    }
  }

  async function openProof(row: Registration) {
    setError("");

    try {
      const response = await fetch(
        `/api/admin/registrations/proof?id=${encodeURIComponent(row.id)}`
      );
      const result = await response.json();

      if (!response.ok || !result.url) {
        throw new Error(result.message || "Bukti tidak dapat dibuka.");
      }

      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal membuka bukti.");
    }
  }

  return (
    <section className="admin-main">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">RUANG PENGELOLA</span>
          <h1>Dashboard</h1>
        </div>
        <button className="admin-refresh" onClick={loadRows}>
          <RefreshCw size={16} /> Segarkan data
        </button>
      </header>

      {error && <div className="admin-alert">{error}</div>}

      <section className="admin-stat-grid">
        <Stat icon={<FileText />} label="Total Pengajuan" value={counts.all} />
        <Stat icon={<Clock3 />} label="Menunggu" value={counts.pending} />
        <Stat icon={<CheckCircle2 />} label="Terverifikasi" value={counts.verified} />
        <Stat icon={<XCircle />} label="Ditolak" value={counts.rejected} />
      </section>

      <section className="admin-panel">
        <div className="panel-heading">
          <div>
            <h2>Pengajuan kolaborasi</h2>
            <p>Periksa data acara, bukti, dan status pengajuan.</p>
          </div>
          <span className="result-count">{filteredRows.length} data</span>
        </div>

        <div className="admin-toolbar">
          <label className="admin-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, kode, acara..."
            />
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter status"
          >
            <option value="all">Semua status</option>
            <option value="pending">Menunggu</option>
            <option value="verified">Terverifikasi</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pengaju</th>
                <th>Nama acara</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="table-empty">Memuat data...</td></tr>
              ) : filteredRows.length === 0 ? (
                <tr><td colSpan={5} className="table-empty">Belum ada pengajuan yang sesuai.</td></tr>
              ) : filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <button className="person-link" onClick={() => setSelected(row)}>
                      <strong>{row.full_name}</strong>
                      <small>{row.registration_code}</small>
                    </button>
                  </td>
                  <td>{row.event_name || "—"}</td>
                  <td>{dateFormat(row.event_date)}</td>
                  <td><span className={`status-badge ${row.status}`}>{statusLabels[row.status]}</span></td>
                  <td>
                    <button className="table-action" onClick={() => setSelected(row)}>Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="admin-footnote">
        <Users size={15} /> Data pengajuan hanya tersedia untuk admin yang terautentikasi.
      </p>

      {selected && (
        <div className="detail-backdrop" onClick={() => setSelected(null)}>
          <section className="detail-drawer" onClick={(e) => e.stopPropagation()}>
            <header className="drawer-header">
              <div>
                <span className="admin-kicker">DETAIL PENGAJUAN</span>
                <h2>{selected.full_name}</h2>
                <p>{selected.registration_code}</p>
              </div>
              <button className="drawer-close" onClick={() => setSelected(null)} aria-label="Tutup">×</button>
            </header>

            <div className="drawer-content">
              <Detail label="WhatsApp" value={selected.whatsapp} />
              <Detail label="Email" value={selected.email} />
              <Detail label="Organisasi" value={selected.organization} />
              <Detail label="Jabatan" value={selected.role} />
              <Detail label="Kota pengaju" value={selected.city} />
              <Detail label="Nama acara" value={selected.event_name} />
              <Detail label="Jenis acara" value={selected.event_type} />
              <Detail label="Tanggal mulai" value={dateFormat(selected.event_date)} />
              <Detail label="Tanggal selesai" value={dateFormat(selected.event_end_date)} />
              <Detail label="Lokasi acara" value={selected.event_location} />
              <Detail label="Perkiraan audiens" value={selected.audience} />
              <Detail label="Kebutuhan fasilitas" value={selected.facility_need} />
              <Detail label="Keterangan" value={selected.description} />
              <Detail label="Konfirmasi TactLink" value={selected.tactlink_downloaded ? "Ya" : "Tidak"} />
              <Detail label="Persetujuan" value={selected.agreement ? "Disetujui" : "Belum"} />

              <button
                className="proof-button"
                onClick={() => openProof(selected)}
              >
                <ArrowDownToLine size={17} /> Buka bukti unggahan
              </button>

              <label className="drawer-label" htmlFor="status-select">Status pengajuan</label>
              <select
                id="status-select"
                value={selected.status}
                disabled={busyId === selected.id}
                onChange={(e) => updateStatus(selected, e.target.value as Registration["status"])}
              >
                <option value="pending">Menunggu</option>
                <option value="verified">Terverifikasi</option>
                <option value="rejected">Ditolak</option>
              </select>

              <button
                className="delete-button"
                disabled={busyId === selected.id}
                onChange={() => deleteRegistration(selected)}
                onClick={() => deleteRegistration(selected)}
              >
                <Trash2 size={16} /> Hapus pengajuan
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <article className="admin-stat">
      <span className="stat-icon">{icon}</span>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}