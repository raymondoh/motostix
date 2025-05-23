import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact MotoStix | Get in Touch",
  description: "Contact our team for questions about our products, orders, or custom designs"
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 w-full bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Contact Us</h1>
            <div className="w-12 h-0.5 bg-primary mb-6"></div>
            <p className="text-muted-foreground text-center max-w-2xl text-lg">
              Have questions or need assistance? We're here to help you with anything related to our products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
                <p className="text-muted-foreground mb-6">
                  We aim to respond to all inquiries within 24 hours during business days. For immediate assistance,
                  please call our customer service line.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Our Location</p>
                    <p className="text-muted-foreground">123 Motorcycle Lane, Speed City, SC 12345</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Phone Number</p>
                    <p className="text-muted-foreground">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Email Address</p>
                    <p className="text-muted-foreground">info@motostix.com</p>
                  </div>
                </div>

                {/* <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>Monday - Friday: 9am - 6pm</li>
                      <li>Saturday: 10am - 4pm</li>
                      <li>Sunday: Closed</li>
                    </ul>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-secondary/5 rounded-xl p-6 shadow-sm border border-border/40">
              <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="bg-background border-border focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="bg-background border-border focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="How can we help you?"
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 w-full">
                  Send Message <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 w-full bg-secondary/5 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Find Us</h2>
            <div className="w-12 h-0.5 bg-primary mb-6"></div>
            <p className="text-muted-foreground text-center max-w-2xl">
              Visit our showroom to see our products in person and speak with our team.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-sm border border-border/40 h-[400px] md:h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215266754809!2d-73.98776692426385!3d40.75797623440235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1710341000000!5m2!1sen!2sus"
              width="600"
              height="450"
              style={{ border: 0, width: "100%", height: "100%" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 w-full bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
            <div className="w-12 h-0.5 bg-primary mb-6"></div>
            <p className="text-muted-foreground text-center max-w-2xl">
              Find quick answers to common questions about our products and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "How long does shipping take?",
                answer:
                  "Standard shipping typically takes 3-5 business days within the continental US. International shipping may take 7-14 business days depending on the destination."
              },
              {
                question: "Are your stickers waterproof?",
                answer:
                  "Yes, all our stickers are made with premium vinyl that is waterproof, UV-resistant, and designed to withstand extreme weather conditions."
              },
              {
                question: "Can I request a custom design?",
                answer:
                  "We offer custom design services. Simply contact us with your requirements, and our design team will work with you to create your perfect sticker."
              },
              {
                question: "What is your return policy?",
                answer:
                  "We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, please contact us for a return authorization."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-secondary/5 rounded-xl p-6 shadow-sm border border-border/40">
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
