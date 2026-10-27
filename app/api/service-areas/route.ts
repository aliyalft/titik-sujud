
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";



const TABLE = "titik_sujud_service_areas";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select("id,city_name,area_status,sort_order,is_visible")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Gagal mengambil jangkauan:", error.message);
    return NextResponse.json(
      { message: "Gagal mengambil jangkauan layanan." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { areas: data ?? [] },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Tidak memiliki akses." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const cityName = typeof body.city_name === "string"
      ? body.city_name.trim()
      : "";
    const areaStatus = body.area_status;
    const sortOrder = Number(body.sort_order ?? 0);

    if (!cityName || cityName.length > 100) {
      return NextResponse.json({ message: "Nama kota wajib diisi (maksimal 100 karakter)." }, { status: 400 });
    }

    if (!["active", "upcoming"].includes(areaStatus)) {
      return NextResponse.json({ message: "Kategori jangkauan tidak valid." }, { status: 400 });
    }

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      return NextResponse.json({ message: "Urutan harus berupa angka nol atau lebih." }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from(TABLE)
      .select("id")
      .ilike("city_name", cityName)
      .eq("area_status", areaStatus)
      .limit(1);

    if (existing?.length) {
      return NextResponse.json({ message: "Kota tersebut sudah ada di kategori ini." }, { status: 409 });
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .insert({
        city_name: cityName,
        area_status: areaStatus,
        sort_order: sortOrder,
      })
      .select("id,city_name,area_status,sort_order,is_visible")
      .single();

    if (error) throw error;

    return NextResponse.json({ area: data }, { status: 201 });
  } catch (error) {
    console.error("Gagal menambahkan jangkauan:", error);
    return NextResponse.json({ message: "Gagal menambahkan kota." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Tidak memiliki akses." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";

    if (!id) {
      return NextResponse.json({ message: "ID kota wajib diisi." }, { status: 400 });
    }

    const updates: Record<string, string | number | boolean> = {};

    if (typeof body.city_name === "string") {
      const name = body.city_name.trim();
      if (!name || name.length > 100) {
        return NextResponse.json({ message: "Nama kota tidak valid." }, { status: 400 });
      }
      updates.city_name = name;
    }

    if (body.area_status !== undefined) {
      if (!["active", "upcoming"].includes(body.area_status)) {
        return NextResponse.json({ message: "Kategori tidak valid." }, { status: 400 });
      }
      updates.area_status = body.area_status;
    }

    if (body.sort_order !== undefined) {
      const order = Number(body.sort_order);
      if (!Number.isInteger(order) || order < 0) {
        return NextResponse.json({ message: "Urutan tidak valid." }, { status: 400 });
      }
      updates.sort_order = order;
    }

    if (typeof body.is_visible === "boolean") {
      updates.is_visible = body.is_visible;
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json({ message: "Tidak ada perubahan yang dikirim." }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .update(updates)
      .eq("id", id)
      .select("id,city_name,area_status,sort_order,is_visible")
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ message: "Kota tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ area: data });
  } catch (error) {
    console.error("Gagal mengubah jangkauan:", error);
    return NextResponse.json({ message: "Gagal mengubah data kota." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Tidak memiliki akses." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";

    if (!id) {
      return NextResponse.json({ message: "ID kota wajib diisi." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ message: "Kota tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ message: "Kota berhasil dihapus." });
  } catch (error) {
    console.error("Gagal menghapus jangkauan:", error);
    return NextResponse.json({ message: "Gagal menghapus kota." }, { status: 500 });
  }
}
