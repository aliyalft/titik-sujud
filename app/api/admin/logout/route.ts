
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { message: "Konfigurasi Supabase belum lengkap." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({
    message: "Logout berhasil.",
  });

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
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { message: "Gagal logout. Silakan coba lagi." },
      { status: 500 }
    );
  }

  return response;
}
