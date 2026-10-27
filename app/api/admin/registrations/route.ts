
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";



const TABLE = "titik_sujud_registrations";

const fields = [
  "id",
  "registration_code",
  "full_name",
  "whatsapp",
  "email",
  "city",
  "organization",
  "role",
  "event_name",
  "event_type",
  "event_date",
  "event_end_date",
  "event_location",
  "audience",
  "facility_need",
  "description",
  "tactlink_downloaded",
  "download_proof_path",
  "additional_proof_path",
  "proof_path",
  "agreement",
  "status",
  "created_at",
].join(",");

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Tidak memiliki akses." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select(fields)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("Gagal mengambil pengajuan:", error.message);
    return NextResponse.json({ message: "Gagal mengambil data pengajuan." }, { status: 500 });
  }

  return NextResponse.json({ registrations: data ?? [] });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Tidak memiliki akses." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    const status = body.status;

    if (!id || !["pending", "verified", "rejected"].includes(status)) {
      return NextResponse.json({ message: "ID atau status tidak valid." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id,status")
      .maybeSingle();

    if (error) {
      console.error("Gagal mengubah status:", error.message);
      return NextResponse.json({ message: "Gagal mengubah status." }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ message: "Pengajuan tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ registration: data });
  } catch {
    return NextResponse.json({ message: "Permintaan tidak valid." }, { status: 400 });
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
      return NextResponse.json({ message: "ID pengajuan wajib diisi." }, { status: 400 });
    }

    const { data: row, error: readError } = await supabaseAdmin
      .from(TABLE)
      .select("id,proof_path,download_proof_path,additional_proof_path")
      .eq("id", id)
      .maybeSingle();

    if (readError) {
      return NextResponse.json({ message: "Gagal memeriksa pengajuan." }, { status: 500 });
    }

    if (!row) {
      return NextResponse.json({ message: "Pengajuan tidak ditemukan." }, { status: 404 });
    }

    const paths = [
      row.proof_path,
      row.download_proof_path,
      row.additional_proof_path,
    ].filter((value): value is string => Boolean(value));

    const uniquePaths = [...new Set(paths)];

    const { error: deleteError } = await supabaseAdmin
      .from(TABLE)
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Gagal menghapus pengajuan:", deleteError.message);
      return NextResponse.json({ message: "Gagal menghapus pengajuan." }, { status: 500 });
    }

    if (uniquePaths.length) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("titik-sujud")
        .remove(uniquePaths);

      if (storageError) {
        console.error("Pembersihan file gagal:", storageError.message);
      }
    }

    return NextResponse.json({ message: "Pengajuan berhasil dihapus." });
  } catch {
    return NextResponse.json({ message: "Permintaan tidak valid." }, { status: 400 });
  }
}
