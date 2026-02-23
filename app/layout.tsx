import type { Metadata, Viewport } from "next";
import { Geist, Dancing_Script } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  weight: ["700"],
});

export const viewport: Viewport = {
  themeColor: "#0d1f2d",
};

export const metadata: Metadata = {
  title: "Salty's Seafood & Takeaway — Chinchilla QLD",
  description: "Fresh seafood made to order. Fish, prawns, burgers & more. Pickup only — 107 Heeney St, Chinchilla QLD 4413.",
  keywords: ["seafood", "takeaway", "chinchilla", "fish and chips", "prawns", "pickup"],
  openGraph: {
    title: "Salty's Seafood & Takeaway",
    description: "Fresh catches, served hot. Order online for pickup — Chinchilla QLD.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${dancing.variable} antialiased`}>{children}</body>
    </html>
  );
}
