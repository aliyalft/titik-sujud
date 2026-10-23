
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

const TABLE_NAME = "titik_sujud_registrations";
const BUCKET_NAME = "titik-sujud";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

function getText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    console.error("Konfigurasi Supabase server belum lengkap.");

    return NextResponse.json(
      { message: "Konfigurasi server belum lengkap." },
      { status: 500 }
    );
  }

  let uploadedPath: string | null = null;

  try {
    const formData = await request.formData();

    const fullName = getText(formData, "fullName");
    const whatsapp = getText(formData, "whatsapp");
    const email = getText(formData, "email");
    const organization = getText(formData, "organization");
    const role = getText(formData, "role");
    const city = getText(formData, "city");
    const eventName = getText(formData, "eventName");
    const eventType = getText(formData, "eventType");
    const eventDate = getText(formData, "eventDate");
    const eventEndDate = getText(formData, "eventEndDate");
    const eventLocation = getText(formData, "eventLocation");
    const audience = getText(formData, "audience");
    const facilityNeed = getText(formData, "facilityNeed");
    const description = getText(formData, "description");

    const agreement = getText(formData, "agreement");
    const tactlinkDownloaded = getText(
      formData,
      "tactlinkDownloaded"
    );

    const proof = formData.get("proof");

    if (!fullName || !whatsapp || !eventName) {
      return NextResponse.json(
        {
          message:
            "Nama lengkap, WhatsApp, dan nama acara wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (agreement !== "true") {
      return NextResponse.json(
        { message: "Persetujuan wajib dicentang." },
        { status: 400 }
      );
    }

    if (tactlinkDownloaded !== "true") {
      return NextResponse.json(
        {
          message:
            "Unduhan TactLink harus dikonfirmasi terlebih dahulu.",
        },
        { status: 400 }
      );
    }

    if (!(proof instanceof File) || proof.size === 0) {
      return NextResponse.json(
        { message: "Bukti unduhan TactLink wajib diunggah." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(proof.type)) {
      return NextResponse.json(
        {
          message:
            "Format bukti harus JPG, PNG, WEBP, atau PDF.",
        },
        { status: 400 }
      );
    }

    if (proof.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Ukuran file maksimal 5 MB." },
        { status: 400 }
      );
    }

    if (eventDate && Number.isNaN(Date.parse(eventDate))) {
      return NextResponse.json(
        { message: "Tanggal acara tidak valid." },
        { status: 400 }
      );
    }

    if (
      eventEndDate &&
      Number.isNaN(Date.parse(eventEndDate))
    ) {
      return NextResponse.json(
        { message: "Tanggal akhir acara tidak valid." },
        { status: 400 }
      );
    }

    if (
      eventDate &&
      eventEndDate &&
      eventEndDate < eventDate
    ) {
      return NextResponse.json(
        {
          message:
            "Tanggal akhir acara tidak boleh sebelum tanggal mulai.",
        },
        { status: 400 }
      );
    }

    const extensionByType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "application/pdf": "pdf",
    };

    const extension = extensionByType[proof.type];
    const filePath = `registrations/${randomUUID()}.${extension}`;

    // 1. Upload bukti ke Supabase Storage.
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, proof, {
        contentType: proof.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload bukti gagal:", uploadError.message);

      return NextResponse.json(
        { message: "Bukti gagal diunggah. Silakan coba lagi." },
        { status: 500 }
      );
    }

    uploadedPath = filePath;

    // 2. Simpan data registrasi ke tabel.
    const { data, error: insertError } = await supabaseAdmin
      .from(TABLE_NAME)
      .insert({
        full_name: fullName,
        whatsapp,
        email: email || null,
        organization: organization || null,
        role: role || null,
        city: city || null,
        event_name: eventName,
        event_type: eventType || null,
        event_date: eventDate || null,
        event_end_date: eventEndDate || null,
        event_location: eventLocation || null,
        audience: audience || null,
        facility_need: facilityNeed || null,
        description: description || null,
        agreement: true,
        tactlink_downloaded: true,
        proof_path: filePath,
        status: "pending",
      })
      .select("registration_code")
      .single();

    if (insertError || !data) {
      console.error(
        "Simpan registrasi gagal:",
        insertError?.message
      );

      // Hapus file jika data gagal disimpan.
      await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      uploadedPath = null;

      return NextResponse.json(
        {
          message:
            "Data registrasi gagal disimpan. Silakan coba lagi.",
        },
        { status: 500 }
      );
    }

    uploadedPath = null;

    // 3. Kembalikan kode registrasi dari database.
    return NextResponse.json(
      {
        message: "Registrasi berhasil disimpan.",
        registrationCode: data.registration_code,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kesalahan API registrasi:", error);

    if (uploadedPath && supabaseAdmin) {
      await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([uploadedPath]);
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
