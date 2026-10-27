
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import JangkauanAdmin from "@/components/admin/JangkauanAdmin";

export default async function JangkauanPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return <JangkauanAdmin />;
}
