import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import FloatingCart from "@/components/FloatingCart";
import StyledJsxRegistry from "./registry";
import Script from "next/script";
import StorefrontFooterWrapper from "@/components/StorefrontFooterWrapper";

export const metadata: Metadata = {
  metadataBase: new URL('https://eternyx.com'),
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
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <StyledJsxRegistry>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <FloatingCart />
            <SmoothScroll />
            {children}
            <StorefrontFooterWrapper />
          </CartProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}

