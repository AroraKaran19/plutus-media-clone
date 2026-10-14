import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { imageUrl } from "./utils/cloudinary";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TikTok Marketing for Consumer Apps",
  description:
    "Viral Micro Influencer Campaigns for Consumer Apps. Fully Done-for-You Content Creation & Social Media Management Program.",
  openGraph: {
    title: "TikTok Marketing for Consumer Apps",
    description:
      "Viral Micro Influencer Campaigns for Consumer Apps. Fully Done-for-You Content Creation & Social Media Management Program.",
    images: [{ url: imageUrl("brand/og-image", 1200), width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${bricolage.variable} ${inter.variable}`}>
      <body className="bg-ink min-h-full font-sans text-white">{children}</body>
    </html>
  );
}
