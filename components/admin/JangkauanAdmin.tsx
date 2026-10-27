"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import "./jangkauan1.css";

type Area = {
  id: string;
  city_name: string;
  area_status: "active" | "upcoming";
  sort_order: number;
  is_visible: boolean;
};

const groups = [
  {
    id: "active" as const,
    title: "Sudah Berjalan",
    subtitle: "Wilayah aktif pelaksanaan mushola portable",
  },
  {
    id: "upcoming" as const,
    title: "Jangkauan Mendatang",
    subtitle: "Wilayah yang sedang dalam persiapan unit",
  },
];

export default function JangkauanAdmin() {
  const router = useRouter();

  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState<"active" | "upcoming">("active");
  const [editing, setEditing] = useState<Area | null>(null);

  const loadAreas = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/service-areas", {
        cache: "no-store",
      });
      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Gagal memuat data wilayah.");
      }

      setAreas(result.areas ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data wilayah."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadAreas();
  }, [loadAreas]);

  async function send(
    method: "POST" | "PATCH" | "DELETE",
    body: Record<string, string | number | boolean>
  ) {
    const response = await fetch("/api/admin/service-areas", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (response.status === 401) {
      router.replace("/admin/login");
      throw new Error("Sesi berakhir. Silakan login kembali.");
    }

    if (!response.ok) {
      throw new Error(result.message || "Operasi gagal.");
    }

    return result;
  }

  async function submitCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editing) {
        await send("PATCH", {
          id: editing.id,
          city_name: trimmedCity,
          area_status: category,
        });
        setNotice("Perubahan wilayah berhasil disimpan.");
      } else {
        const order =
          Math.max(
            0,
            ...areas
              .filter((area) => area.area_status === category)
              .map((area) => area.sort_order)
          ) + 1;

        await send("POST", {
          city_name: trimmedCity,
          area_status: category,
          sort_order: order,
        });
        setNotice("Wilayah berhasil ditambahkan.");
      }

      setCity("");
      setCategory("active");
      setEditing(null);

      await loadAreas();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan wilayah."
      );
    } finally {
      setSaving(false);
    }
  }

  function startEdit(area: Area) {
    setEditing(area);
    setCity(area.city_name);
    setCategory(area.area_status);
    setError("");
    setNotice("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditing(null);
    setCity("");
    setCategory("active");
    setError("");
    setNotice("");
  }

  async function toggleVisibility(area: Area) {
    setError("");
    setNotice("");

    try {
      await send("PATCH", {
        id: area.id,
        is_visible: !area.is_visible,
      });

      await loadAreas();

      setNotice(
        area.is_visible
          ? `${area.city_name} disembunyikan dari landing page.`
          : `${area.city_name} ditampilkan kembali di landing page.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengubah tampilan."
      );
    }
  }

  async function changeOrder(area: Area, direction: -1 | 1) {
    const group = areas
      .filter((item) => item.area_status === area.area_status)
      .sort((a, b) => a.sort_order - b.sort_order);

    const index = group.findIndex((item) => item.id === area.id);
    const target = group[index + direction];

    if (!target) return;

    setError("");
    setNotice("");

    try {
      await send("PATCH", {
        id: area.id,
        sort_order: target.sort_order,
      });

      await send("PATCH", {
        id: target.id,
        sort_order: area.sort_order,
      });

      await loadAreas();
      setNotice("Urutan wilayah berhasil diperbarui.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengurutkan wilayah."
      );
    }
  }

  async function deleteArea(area: Area) {
    const confirmed = window.confirm(
      `Hapus ${area.city_name} dari jangkauan layanan?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await send("DELETE", { id: area.id });
      setNotice(`${area.city_name} berhasil dihapus.`);
      await loadAreas();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menghapus wilayah."
      );
    }
  }

  return (
    <section className="admin-main">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">PENGELOLAAN WILAYAH</span>
          <h1>Jangkauan layanan</h1>
        </div>

        <button
          className="admin-refresh"
          type="button"
          onClick={() => void loadAreas()}
          disabled={loading}
        >
          <RefreshCw size={16} />
          {loading ? "Memuat..." : "Segarkan"}
        </button>
      </header>

      <section className="admin-welcome">
        <div>
          <span className="welcome-label">TITIK SUJUD · JANGKAUAN</span>
          <h2>Hadirkan ruang untuk bersujud, lebih dekat.</h2>
          <p>
            Kelola wilayah yang ditampilkan di halaman utama. Perubahan
            tersimpan di database.
          </p>
        </div>

        <div className="welcome-leaf">
          <MapPin size={47} strokeWidth={1.3} />
        </div>
      </section>

      {error && (
        <div className="admin-alert" role="alert">
          {error}
        </div>
      )}

      {notice && (
        <div className="area-notice" role="status">
          {notice}
        </div>
      )}

      <section className="admin-panel area-form-panel">
        <div className="panel-heading">
          <div>
            <h2>{editing ? "Edit wilayah" : "Tambah wilayah"}</h2>
            <p>
              Masukkan nama kota dan pilih kategori jangkauannya.
            </p>
          </div>
        </div>

        <form className="area-form" onSubmit={submitCity}>
          <label>
            Nama kota atau wilayah
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              maxLength={100}
              placeholder="Contoh: Makassar"
              autoComplete="off"
              required
            />
          </label>

          <label>
            Kategori jangkauan
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as "active" | "upcoming")
              }
            >
              <option value="active">Sudah Berjalan</option>
              <option value="upcoming">Jangkauan Mendatang</option>
            </select>
          </label>

          <div className="area-form-actions">
            <button
              className="area-submit"
              type="submit"
              disabled={saving}
            >
              <Plus size={17} />
              {saving
                ? "Menyimpan..."
                : editing
                  ? "Simpan Perubahan"
                  : "Tambah Kota"}
            </button>

            {editing && (
              <button
                type="button"
                className="area-cancel"
                onClick={cancelEdit}
                disabled={saving}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </section>

      {loading ? (
        <section className="admin-panel area-list-panel">
          <p className="area-loading">Memuat data wilayah...</p>
        </section>
      ) : (
        groups.map((group) => {
          const items = areas
            .filter((area) => area.area_status === group.id)
            .sort((a, b) => a.sort_order - b.sort_order);

          return (
            <section
              className="admin-panel area-list-panel"
              key={group.id}
            >
              <div className="panel-heading">
                <div>
                  <h2>{group.title}</h2>
                  <p>{group.subtitle}</p>
                </div>

                <span className="result-count">
                  {items.length} wilayah
                </span>
              </div>

              <div className="area-list">
                {items.length === 0 && (
                  <p className="area-empty">
                    Belum ada wilayah dalam kategori ini.
                  </p>
                )}

                {items.map((area, index) => (
                  <article
                    className={`area-item ${
                      !area.is_visible ? "area-hidden" : ""
                    }`}
                    key={area.id}
                  >
                    <span className={`area-pin ${group.id}`}>
                      <MapPin size={19} />
                    </span>

                    <div className="area-name">
                      <strong>{area.city_name}</strong>
                      <small>
                        {area.is_visible
                          ? "Tampil di landing page"
                          : "Disembunyikan dari landing page"}
                      </small>
                    </div>

                    <div className="area-actions">
                      <button
                        type="button"
                        title="Naikkan urutan"
                        aria-label={`Naikkan urutan ${area.city_name}`}
                        disabled={index === 0}
                        onClick={() => void changeOrder(area, -1)}
                      >
                        <ArrowUp size={16} />
                      </button>

                      <button
                        type="button"
                        title="Turunkan urutan"
                        aria-label={`Turunkan urutan ${area.city_name}`}
                        disabled={index === items.length - 1}
                        onClick={() => void changeOrder(area, 1)}
                      >
                        <ArrowDown size={16} />
                      </button>

                      <button
                        type="button"
                        title={area.is_visible ? "Sembunyikan" : "Tampilkan"}
                        aria-label={
                          area.is_visible
                            ? `Sembunyikan ${area.city_name}`
                            : `Tampilkan ${area.city_name}`
                        }
                        onClick={() => void toggleVisibility(area)}
                      >
                        {area.is_visible ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>

                      <button
                        type="button"
                        title="Edit kota"
                        aria-label={`Edit ${area.city_name}`}
                        onClick={() => startEdit(area)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="area-delete"
                        title="Hapus kota"
                        aria-label={`Hapus ${area.city_name}`}
                        onClick={() => void deleteArea(area)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })
      )}
    </section>
  );
}