import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function PromoSection() {
  return (
    <section className="py-12 bg-secondary/5 border-y border-border/40">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Limited Time Offer</h2>
            <div className="w-12 h-0.5 bg-accent mb-6"></div>
            <p className="text-muted-foreground text-lg mb-6">
              Get 15% off your first order when you sign up for our newsletter. Plus, receive exclusive access to new
              designs and promotions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">SHOP NOW</Button>
              <Button variant="outline" className="border-primary/20 hover:border-primary/40">
                LEARN MORE <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="border border-border/40 p-6 rounded-lg max-w-sm w-full bg-background shadow-sm">
            <h3 className="text-xl font-bold mb-3">Join Our Community</h3>
            <div className="w-8 h-0.5 bg-accent mb-4"></div>
            <p className="text-muted-foreground mb-4">Sign up to receive updates, exclusive offers, and more!</p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-md bg-background border border-border focus:border-primary focus:outline-none"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">SUBSCRIBE</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
