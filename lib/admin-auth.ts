
import { createClient } from "@/lib/supabase-server";

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return false;

    // Hanya akun yang secara eksplisit diberi role admin
    // melalui app_metadata yang boleh masuk dashboard.
    return user.app_metadata?.role === "admin";
  } catch {
    return false;
  }
}
