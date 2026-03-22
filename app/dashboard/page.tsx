// app/dashboard/page.tsx
// Server Component — fetches real data then passes down to the client UI

import { getRecentReadings, getChartData, getStats } from "@/lib/supabase/sensor-queries";
import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
  const [recentReadings, chartData, stats] = await Promise.all([
    getRecentReadings(),
    getChartData(),
    getStats(),
  ]);

  return (
    <DashboardClient
      recentReadings={recentReadings}
      chartData={chartData}
      stats={stats}
    />
  );
}