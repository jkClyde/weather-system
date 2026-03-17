// app/layout.tsx
import { Oxygen, Fira_Code } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebarLayout } from "@/components/app-sidebar-layout";

// Import Oxygen
const oxygen = Oxygen({
  subsets: ["latin"],
  variable: "--font-oxygen",
  weight: ["300", "400", "700"], 
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  weight: ["400", "500", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oxygen.variable} ${firaCode.variable}`}>
      <body className="antialiased font-sans">
        <TooltipProvider>
          <AppSidebarLayout>
            {children}
          </AppSidebarLayout>
        </TooltipProvider>
      </body>
    </html>
  );
}