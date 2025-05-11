// import Link from "next/link";
// import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import Image from "next/image";
// import { StripeIcon } from "../shared/StripeIcon";

// export function Footer() {
//   return (
//     <footer className="bg-secondary/10 border-t border-border">
//       {/* Main Footer Content */}
//       <div className="container px-4 py-12 md:py-16">
//         <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
//           {/* Column 1: Logo and About */}
//           <div className="space-y-4">
//             <div className="flex items-center">
//               <span className="text-2xl font-bold tracking-tight">
//                 MOTO<span className="text-accent">STIX</span>
//               </span>
//             </div>
//             <p className="text-muted-foreground">
//               Premium motorcycle decals and stickers for riders who demand the best. Quality, durability, and style for
//               your bike.
//             </p>
//             <div className="flex space-x-4">
//               <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
//                 <Facebook className="h-5 w-5" />
//                 <span className="sr-only">Facebook</span>
//               </Link>
//               <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
//                 <Instagram className="h-5 w-5" />
//                 <span className="sr-only">Instagram</span>
//               </Link>
//               <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
//                 <Twitter className="h-5 w-5" />
//                 <span className="sr-only">Twitter</span>
//               </Link>
//               <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
//                 <StripeIcon className="h-5 w-5" />
//                 <span className="sr-only">YouTube</span>
//               </Link>
//             </div>
//           </div>

//           {/* Column 2: Quick Links */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-bold">Quick Links</h3>
//             <ul className="space-y-2">
//               {[
//                 { name: "Sport Bike Decals", href: "/category/sport-bike" },
//                 { name: "Cruiser Graphics", href: "/category/cruiser" },
//                 { name: "Off-Road Stickers", href: "/category/off-road" },
//                 { name: "Custom Designs", href: "/category/custom" },
//                 { name: "About Us", href: "/about" }
//               ].map(item => (
//                 <li key={item.name}>
//                   <Link
//                     href={item.href}
//                     className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
//                     <span className="text-primary text-xs">›</span> {item.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 3: Contact Info */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-bold">Contact Us</h3>
//             <ul className="space-y-3">
//               <li className="flex items-start gap-3">
//                 <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
//                 <span className="text-muted-foreground">123 Motorcycle Lane, Speed City, SC 12345</span>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Phone className="h-5 w-5 text-primary shrink-0" />
//                 <span className="text-muted-foreground">(555) 123-4567</span>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Mail className="h-5 w-5 text-primary shrink-0" />
//                 <span className="text-muted-foreground">info@motostix.com</span>
//               </li>
//             </ul>
//           </div>

//           {/* Column 4: Newsletter */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-bold">Newsletter</h3>
//             <p className="text-muted-foreground">
//               Subscribe to our newsletter for the latest designs, promotions, and exclusive offers.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-2">
//               <div className="relative flex-1">
//                 <Input
//                   type="email"
//                   placeholder="Your email"
//                   className="pr-10 bg-background border-border focus:border-primary"
//                 />
//               </div>
//               <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
//                 Subscribe <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Payment Methods */}
//       <div className="border-t border-border/40 py-6">
//         <div className="container px-4">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="text-muted-foreground text-sm">Secure payments provided by trusted partners</div>

//             <div className="flex items-center gap-4 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
//               <Image src="/images/visa-card-logo.png" alt="Visa" className="h-8" width={80} height={32} />
//               <Image src="/images/mastercard-logo.png" alt="Mastercard" className="h-8" width={80} height={32} />
//               <Image src="/images/paypal-logo.png" alt="PayPal" className="h-8" width={80} height={32} />
//               <Image src="/images/apple-pay-logo.png" alt="Apple Pay" className="h-8" width={80} height={32} />
//               <Image src="/images/google-pay.png" alt="Google Pay" width={80} height={32} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Footer */}
//       <div className="border-t border-border/40 py-4">
//         <div className="container px-4">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="text-muted-foreground text-sm text-center md:text-left">
//               © {new Date().getFullYear()} MotoStix. All rights reserved.
//             </div>
//             <div className="flex flex-wrap justify-center gap-4 text-sm">
//               <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
//                 Privacy Policy
//               </Link>
//               <Separator orientation="vertical" className="hidden md:block h-4" />
//               <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
//                 Terms of Service
//               </Link>
//               <Separator orientation="vertical" className="hidden md:block h-4" />
//               <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
//                 Shipping Policy
//               </Link>
//               <Separator orientation="vertical" className="hidden md:block h-4" />
//               <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
//                 Returns & Refunds
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">StickerHub</h3>
            <p className="text-sm text-gray-600">
              Premium quality stickers for your car and bike adventures. Express yourself with our weather-resistant,
              durable designs.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=car" className="text-gray-600 hover:text-gray-900">
                  Car Stickers
                </Link>
              </li>
              <li>
                <Link href="/products?category=bike" className="text-gray-600 hover:text-gray-900">
                  Bike Stickers
                </Link>
              </li>
              <li>
                <Link href="/products?category=adventure" className="text-gray-600 hover:text-gray-900">
                  Adventure Series
                </Link>
              </li>
              <li>
                <Link href="/products?category=custom" className="text-gray-600 hover:text-gray-900">
                  Custom Designs
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-gray-600 hover:text-gray-900">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-gray-900">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-gray-600 hover:text-gray-900">
                  Care Instructions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Newsletter</h3>
            <p className="mb-4 text-sm text-gray-600">Subscribe to get special offers and new design alerts.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-l-lg border border-gray-300 px-4 py-2 focus:border-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-r-lg bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-700">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-secondary/20 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} StickerHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
