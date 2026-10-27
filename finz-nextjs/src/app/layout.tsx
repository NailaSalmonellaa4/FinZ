import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinZ — Platform Edukasi Finansial & Micro-Investing",
  description:
    "Platform edukasi literasi keuangan, budgeting 50/30/20, target tabungan, dan simulasi investasi virtual tanpa risiko uang asli untuk Gen Z.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F4F7FC] text-[#0F172A] font-body selection:bg-purple-100 selection:text-purple-900">
        {children}
      </body>
    </html>
  );
}
