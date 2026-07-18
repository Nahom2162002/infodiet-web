import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Lora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "InfoDiet — Feed your mind the way you'd feed your body",
  description:
    "InfoDiet quietly notices what you read, watch, and scroll — then helps you nudge the balance toward what actually nourishes you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${lora.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="aXZ_mc5Oh5orpWfSXD5yRtzxrk9vwEruYrgLodMIgig" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
