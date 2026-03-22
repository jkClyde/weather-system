// app/report/page.tsx  — Server Component
import { getReportData } from "@/lib/supabase/sensor-queries";
import { ReportClient } from "@/components/report-client";

export default async function ReportPage() {
    const data = await getReportData();
    return <ReportClient {...data} />;
}