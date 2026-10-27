
"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CalendarDays, MapPin, Compass } from "lucide-react";
import "./ServiceAreas.css";

type Area = {
  id: string;
  city_name: string;
  area_status: "active" | "upcoming";
  sort_order: number;
};

export default function ServiceAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    fetch("/api/service-areas", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Gagal memuat jangkauan.");
        return response.json();
      })
      .then((result) => {
        if (alive) setAreas(result.areas ?? []);
      })
      .catch((error) => {
        console.error("Jangkauan layanan:", error);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const active = areas
    .filter((area) => area.area_status === "active")
    .sort((a, b) => a.sort_order - b.sort_order);

  const upcoming = areas
    .filter((area) => area.area_status === "upcoming")
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section className="service-areas" id="jangkauan">
      <div className="service-areas-intro">
        <span className="service-eyebrow">
          <span>05</span> JANGKAUAN LAYANAN
        </span>

        <h2>
          Melangkah lebih jauh, menghadirkan{" "}
          <em>kebaikan.</em>
        </h2>

        <p>
          Titik Sujud telah hadir di sejumlah wilayah dan terus
          mempersiapkan jangkauan berikutnya. Setiap pengajuan akan
          ditinjau berdasarkan lokasi, jadwal, dan ketersediaan unit.
        </p>

        <div className="service-note">
          <Compass size={19} />
          <span>Siap melayani pengajuan di seluruh wilayah Indonesia</span>
        </div>
      </div>

      <div className="service-areas-lists">
        <AreaCard
          title="Sudah Berjalan"
          subtitle="Wilayah aktif pelaksanaan musholla portable"
          icon={<CheckCircle2 size={25} />}
          type="active"
          areas={active}
          loading={loading}
        />

        <AreaCard
          title="Jangkauan Mendatang"
          subtitle="Wilayah yang sedang dalam persiapan unit"
          icon={<CalendarDays size={25} />}
          type="upcoming"
          areas={upcoming}
          loading={loading}
        />
      </div>
    </section>
  );
}

function AreaCard({
  title,
  subtitle,
  icon,
  type,
  areas,
  loading,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  type: "active" | "upcoming";
  areas: Area[];
  loading: boolean;
}) {
  return (
    <article className={`service-area-card ${type}`}>
      <header className="service-area-heading">
        <span className="service-area-icon">{icon}</span>
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </header>

      <div className="service-area-divider" />

      <div className="service-city-list">
        {loading ? (
          <span className="service-city-empty">Memuat wilayah...</span>
        ) : areas.length ? (
          areas.map((area) => (
            <span className="service-city" key={area.id}>
              <MapPin size={16} />
              {area.city_name}
            </span>
          ))
        ) : (
          <span className="service-city-empty">
            Belum ada wilayah yang ditampilkan.
          </span>
        )}
      </div>
    </article>
  );
}
