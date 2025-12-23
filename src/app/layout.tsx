import type { Metadata } from "next";
import { Cinzel, Crimson_Text, Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ui/ClientLayout";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Realm of Adventures | D&D Online Campaign Manager",
  description: "Play Dungeons & Dragons online with friends. Complete campaign management, character sheets, dice rolling, combat tracking, and virtual tabletop.",
  keywords: ["D&D", "Dungeons and Dragons", "RPG", "tabletop", "online gaming", "campaign manager"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${crimsonText.variable} ${inter.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
