import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppSidebarLayout } from "@/components/app-sidebar-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const name = user.user_metadata?.full_name ?? "";
  const email = user.email ?? "";

  return (
    <AppSidebarLayout user={{ name, email }}>
      {children}
    </AppSidebarLayout>
  );
}