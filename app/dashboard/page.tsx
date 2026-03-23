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