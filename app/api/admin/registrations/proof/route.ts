
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Tidak memiliki akses." }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID pengajuan wajib diisi." }, { status: 400 });
  }

  const { data: row, error } = await supabaseAdmin
    .from("titik_sujud_registrations")
    .select("proof_path,download_proof_path,additional_proof_path")
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    return NextResponse.json({ message: "Pengajuan tidak ditemukan." }, { status: 404 });
  }

  const path = row.proof_path || row.download_proof_path || row.additional_proof_path;

  if (!path) {
    return NextResponse.json({ message: "Bukti belum tersedia." }, { status: 404 });
  }

  const { data, error: storageError } = await supabaseAdmin.storage
    .from("titik-sujud")
    .createSignedUrl(path, 60);

  if (storageError || !data?.signedUrl) {
    return NextResponse.json({ message: "Bukti tidak dapat dibuka." }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
