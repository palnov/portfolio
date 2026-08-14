import type { Metadata } from "next";
import { Montserrat, Manrope } from "next/font/google";
import "./globals.css";

// Select Outfit/Montserrat & Manrope for Russian/Cyrillic luxury font pairing
const headingFont = Montserrat({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "800", "900"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PANDA Detailing Studio | Премиальный детейлинг автомобилей в Москве",
  description: "Профессиональный детейлинг автомобилей: полировка, керамические покрытия, оклейка полиуретановой пленкой (PPF) и химчистка салона.",
  keywords: ["детейлинг", "полировка авто", "керамика на авто", "оклейка пленкой", "химчистка салона", "PANDA", "москва детейлинг"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#070809] text-gray-100 font-sans selection:bg-lime-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
