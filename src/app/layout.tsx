import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "ETERNYX | Silence is Luxury",
  description: "A professional luxury perfume brand website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <SmoothScroll />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
