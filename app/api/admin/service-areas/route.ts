
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";



const TABLE = "titik_sujud_service_areas";

async function authorized() {
  return isAdminAuthenticated();
}

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json({ message: "Tidak memiliki akses." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select("id,city_name,area_status,sort_order,is_visible")
    .order("area_status", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ message: "Gagal mengambil data wilayah." }, { status: 500 });
  }

  return NextResponse.json({ areas: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ message: "Tidak memiliki akses." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const city_name = typeof body.city_name === "string" ? body.city_name.trim() : "";
    const area_status = body.area_status;
    const sort_order = Number(body.sort_order ?? 0);

    if (!city_name || city_name.length > 100) {
      return NextResponse.json({ message: "Nama kota tidak valid." }, { status: 400 });
    }

    if (!["active", "upcoming"].includes(area_status)) {
      return NextResponse.json({ message: "Kategori tidak valid." }, { status: 400 });
    }

    if (!Number.isInteger(sort_order) || sort_order < 0) {
      return NextResponse.json({ message: "Urutan tidak valid." }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from(TABLE)
      .select("id")
      .ilike("city_name", city_name)
      .eq("area_status", area_status)
      .limit(1);

    if (existing?.length) {
      return NextResponse.json({ message: "Kota sudah ada dalam kategori ini." }, { status: 409 });
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .insert({ city_name, area_status, sort_order })
      .select("id,city_name,area_status,sort_order,is_visible")
      .single();

    if (error) throw error;

    return NextResponse.json({ area: data }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Gagal menambahkan wilayah." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ message: "Tidak memiliki akses." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";

    if (!id) {
      return NextResponse.json({ message: "ID kota wajib diisi." }, { status: 400 });
    }

    const updates: Record<string, string | number | boolean> = {};

    if (body.city_name !== undefined) {
      const name = typeof body.city_name === "string" ? body.city_name.trim() : "";
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
      return NextResponse.json({ message: "Tidak ada perubahan." }, { status: 400 });
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
  } catch {
    return NextResponse.json({ message: "Gagal mengubah wilayah." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await authorized())) {
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
  } catch {
    return NextResponse.json({ message: "Gagal menghapus wilayah." }, { status: 500 });
  }
}
