import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="main-footer py-8 md:py-12 lg:py-16 w-full bg-secondary/10 border-t border-border/40">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold tracking-tight">
                MOTO<span className="text-primary">STIX</span>
              </span>
            </div>
            <p className="text-muted-foreground">
              Premium motorcycle decals and stickers for riders who demand the best. Quality, durability, and style for
              your bike.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Shop</h3>
            <ul className="space-y-2">
              {[
                { name: "Sport Bike Decals", href: "/category/sport-bike" },
                { name: "Cruiser Graphics", href: "/category/cruiser" },
                { name: "Off-Road Stickers", href: "/category/off-road" },
                { name: "Custom Designs", href: "/category/custom" },
                { name: "Collections", href: "/collections" }
              ].map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    <span className="text-primary text-xs">›</span> {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">123 Motorcycle Lane, Speed City, SC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">info@motostix.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Newsletter</h3>
            <p className="text-muted-foreground">
              Subscribe to our newsletter for the latest designs, promotions, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-background border-border focus:border-primary"
              />
              <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-border/40 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">Secure payments provided by trusted partners</div>

            <div className="flex items-center gap-4 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Image src="/images/visa-card-logo.png" alt="Visa" className="h-8" width={80} height={32} />
              <Image src="/images/mastercard-logo.png" alt="Mastercard" className="h-8" width={80} height={32} />
              <Image src="/images/paypal-logo.png" alt="PayPal" className="h-8" width={80} height={32} />
              <Image src="/images/apple-pay-logo.png" alt="Apple Pay" className="h-8" width={80} height={32} />
              <Image src="/images/google-pay.png" alt="Google Pay" width={80} height={32} />
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border/40 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm text-center md:text-left">
              © {new Date().getFullYear()} MotoStix. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Separator orientation="vertical" className="hidden md:block h-4" />
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Separator orientation="vertical" className="hidden md:block h-4" />
              <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                Shipping Policy
              </Link>
              <Separator orientation="vertical" className="hidden md:block h-4" />
              <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                Returns & Refunds
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
