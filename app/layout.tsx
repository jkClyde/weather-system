// app/layout.tsx
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebarLayout } from "@/components/app-sidebar-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  weight: ["400", "500", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="antialiased">
        <TooltipProvider>
          <AppSidebarLayout>
            {children}
          </AppSidebarLayout>
        </TooltipProvider>
      </body>
    </html>
  );
}