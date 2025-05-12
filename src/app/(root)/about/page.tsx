import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "About MotoStix | Premium Motorcycle Decals",
  description: "Learn about our passion for creating high-quality motorcycle decals and stickers"
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 w-full bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">About MotoStix</h1>
            <div className="w-12 h-0.5 bg-primary mb-6"></div>
            <p className="text-muted-foreground text-center max-w-3xl text-lg">
              We're passionate riders creating premium quality decals and stickers for motorcycles and cars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p>
                Founded in 2018 by a group of motorcycle enthusiasts, MotoStix has grown from a small garage operation
                to a leading provider of premium decals and stickers for riders worldwide.
              </p>
              <p>
                Our mission is simple: create high-quality, weather-resistant designs that help riders express their
                passion and personality through their bikes and cars.
              </p>
              <p>
                What sets us apart is our commitment to quality materials, precision cutting, and designs created by
                riders, for riders. We understand the connection between you and your machine, and we're here to help
                you make it uniquely yours.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm">
              <Image
                src="/bike.jpg"
                alt="MotoStix workshop"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 w-full bg-secondary/5 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Our Values</h2>
            <div className="w-12 h-0.5 bg-primary mb-6"></div>
            <p className="text-muted-foreground text-center max-w-2xl">
              The principles that guide everything we do at MotoStix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Quality",
                description:
                  "We use only premium vinyl and materials that can withstand extreme weather conditions and UV exposure."
              },
              {
                title: "Community",
                description:
                  "We support the riding community through sponsorships, events, and collaborations with local clubs."
              },
              {
                title: "Innovation",
                description:
                  "We're constantly exploring new materials, techniques, and designs to push the boundaries of what's possible."
              }
            ].map((value, index) => (
              <div key={index} className="bg-background rounded-xl p-6 shadow-sm border border-border/40">
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <div className="w-8 h-0.5 bg-primary mb-4"></div>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 w-full bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Meet Our Team</h2>
            <div className="w-12 h-0.5 bg-primary mb-6"></div>
            <p className="text-muted-foreground text-center max-w-2xl">
              The passionate riders and creators behind MotoStix.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Alex Johnson",
                role: "Founder & Designer",
                image: "/car.jpg"
              },
              {
                name: "Sarah Miller",
                role: "Production Manager",
                image: "/bike.jpg"
              },
              {
                name: "Mike Thompson",
                role: "Marketing Director",
                image: "/car.jpg"
              },
              {
                name: "Jessica Lee",
                role: "Customer Support",
                image: "/bike.jpg"
              }
            ].map((member, index) => (
              <div
                key={index}
                className="bg-background rounded-xl overflow-hidden shadow-sm border border-border/40 transition-all hover:shadow-md hover:border-primary/20">
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 w-full bg-secondary/5 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Get In Touch</h2>
            <div className="w-12 h-0.5 bg-primary mb-6"></div>
            <p className="text-muted-foreground text-center max-w-2xl">
              Have questions or want to learn more about our products? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">123 Motorcycle Lane, Speed City, SC 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">info@motostix.com</span>
              </div>
              <div className="pt-4">
                <p className="mb-4">Business Hours:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Monday - Friday: 9am - 6pm</li>
                  <li>Saturday: 10am - 4pm</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215266754809!2d-73.98776692426385!3d40.75797623440235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1710341000000!5m2!1sen!2sus"
                width="600"
                height="450"
                style={{ border: 0, width: "100%", height: "100%", minHeight: "300px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
