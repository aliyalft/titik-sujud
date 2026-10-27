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
        { message: "Konfigurasi Supabase belum lengkap." },
        { status: 500 }
      );
    }

    // Buat penampung untuk cookies yang akan diset oleh Supabase
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
            // Simpan cookie ke dalam array sementara
            cookiesToSetOnResponse = cookiesToSet;
          },
        },
      }
    );

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error || !data.user) {
      return NextResponse.json(
        { message: "Email atau password tidak sesuai." },
        { status: 401 }
      );
    }

    if (data.user.app_metadata?.role !== "admin") {
      await supabase.auth.signOut();

      return NextResponse.json(
        { message: "Akun ini tidak memiliki akses admin." },
        { status: 403 }
      );
    }

    // 1. Buat response BERHASIL setelah proses auth selesai
    const response = NextResponse.json({
      message: "Login berhasil.",
    });

    // 2. Masukkan semua cookie auth Supabase ke dalam response Vercel secara aman
    cookiesToSetOnResponse.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Permintaan login tidak valid." },
      { status: 400 }
    );
  }
}