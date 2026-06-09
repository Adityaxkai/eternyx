import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import FloatingCart from "@/components/FloatingCart";
import StyledJsxRegistry from "./registry";

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
        <StyledJsxRegistry>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <FloatingCart />
            <SmoothScroll />
            <Cursor />
            {children}
          </CartProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}

