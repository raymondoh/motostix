import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Header, FooterWrapper } from "@/components"
import { Providers } from "@/providers/SessionProvider"
import { CartProvider } from "@/contexts/CartContext"
import { LikesProvider } from "@/contexts/LikesContext"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { SearchProvider } from "@/contexts/SearchContext"
import { SearchDataLoader } from "@/components/search/search-data-loader"
import { SearchModal } from "@/components/search/search-modal"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Root Layout",
  description: "Root Layout",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <SearchProvider>
            <CartProvider>
              <LikesProvider>
                {/* Search components */}
                <SearchDataLoader collections={["users", "products", "posts"]} />
                <Suspense fallback={<div className="hidden">Loading search...</div>}>
                  <SearchModal />
                </Suspense>

                {/* Main layout structure */}
                <Header />
                <div className="flex flex-col min-h-screen">
                  <div className="flex-1">{children}</div>
                  <FooterWrapper />
                </div>

                {/* Cart sidebar */}
                <CartSidebar />
              </LikesProvider>
            </CartProvider>
          </SearchProvider>
        </Providers>
      </body>
    </html>
  )
}
