import type { Metadata } from "next";
import { Geist, Dancing_Script } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Salty's Seafood & Takeaway",
  description: "Fresh catches, served hot. Order online for pickup.",
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
