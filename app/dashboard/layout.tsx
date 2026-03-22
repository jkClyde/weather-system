// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { AppSidebarLayout } from "@/components/app-sidebar-layout";

// cache() memoizes this per request — if multiple server components
// call getUser() in the same render, Supabase is only hit once.
const getUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error } = await getUser();

  if (error || !user) {
    redirect("/login");
  }

  const name = user!.user_metadata?.full_name ?? "";
  const email = user!.email ?? "";

  return (
    <AppSidebarLayout user={{ name, email }}>
      {children}
    </AppSidebarLayout>
  );
}