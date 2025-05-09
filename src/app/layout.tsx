//src/app/layout.tsx
import { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import { Header, FooterWrapper } from "@/components";
import { Providers } from "@/providers/SessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import { LikesProvider } from "@/contexts/LikesContext";
import { CartSidebar } from "@/components/cart/cart-sidebar";

import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Root Layout",
  description: "Root Layout"
};

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <CartProvider>
            <LikesProvider>
              <Header />
              <div className="flex flex-col min-h-screen">
                <div className="flex-1">{children}</div>
                <FooterWrapper />
              </div>
            </LikesProvider>
            <CartSidebar />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
