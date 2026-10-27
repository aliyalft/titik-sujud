import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email.trim() : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { message: "Konfigurasi Supabase belum lengkap di Vercel (URL/Key kosong)." },
        { status: 500 }
      );
    }

    // Penampung cookie dari Supabase
    let cookiesToSetOnResponse: Array<{ name: string; value: string; options: any }> = [];

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            const cookieHeader = request.headers.get("cookie") ?? "";

            return cookieHeader
              .split(";")
              .map((cookie) => cookie.trim())
              .filter(Boolean)
              .map((cookie) => {
                const separator = cookie.indexOf("=");

                return {
                  name:
                    separator === -1
                      ? cookie
                      : cookie.slice(0, separator),
                  value:
                    separator === -1
                      ? ""
                      : cookie.slice(separator + 1),
                };
              });
          },
          setAll(cookiesToSet) {
            cookiesToSetOnResponse = cookiesToSet;
          },
        },
      }
    );

    // 1. Proses Sign In ke Supabase
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    // 🛑 JIKA LOGIN GAGAL DI SUPABASE
    if (error || !data.user) {
      console.error("DEBUG SUPABASE AUTH ERROR:", error);
      return NextResponse.json(
        { 
          message: `Gagal Supabase: ${error?.message || "User tidak ditemukan."}` 
        },
        { status: 401 }
      );
    }

    // 2. Cek Role Admin (Mengakomodasi baik app_metadata maupun raw_app_meta_data)
    const userRole = 
      data.user.app_metadata?.role || 
      (data.user as any).raw_app_meta_data?.role;

    if (userRole !== "admin") {
      await supabase.auth.signOut();

      console.warn("DEBUG ROLE ERROR: Role terdeteksi sebagai:", userRole);
      return NextResponse.json(
        { 
          message: `Akun ini tidak memiliki akses admin (Role saat ini: "${userRole || 'tidak ada'}").` 
        },
        { status: 403 }
      );
    }

    // 3. Jika berhasil, buat Response dan tempelkan Cookie
    const response = NextResponse.json({
      message: "Login berhasil.",
    });

    cookiesToSetOnResponse.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  } catch (err: any) {
    console.error("DEBUG INTERNAL SERVER ERROR:", err);
    return NextResponse.json(
      { message: `Permintaan login tidak valid: ${err?.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}