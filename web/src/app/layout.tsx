import type { Metadata } from "next";
import Providers from "@/app/providers";
import { AppFooter } from "@/components/ideation/AppFooter";
import "@/index.css";

export const metadata: Metadata = {
  title: "P.I.E. · Product Ideation Engine",
  description: "Internal workbench for pitch cards, research dossiers, and signal reactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <AppFooter />
        </Providers>
      </body>
    </html>
  );
}
