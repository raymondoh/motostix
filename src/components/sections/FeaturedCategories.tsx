import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Sport Bike Decals",
    image: "/bike.jpg",
    slug: "/category/sport-bike",
    count: 42
  },
  {
    name: "Cruiser Graphics",
    image: "/car.jpg",
    slug: "/category/cruiser",
    count: 38
  },
  {
    name: "Off-Road Stickers",
    image: "/bike.jpg",
    slug: "/category/off-road",
    count: 56
  },
  {
    name: "Custom Designs",
    image: "/car.jpg",
    slug: "/category/custom",
    count: 24
  }
];

export function FeaturedCategories() {
  return (
    <section className="py-16 bg-secondary/5 border-y border-border/40">
      <div className="container">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Shop By Category</h2>
          <div className="w-12 h-0.5 bg-primary mb-6"></div>
          <p className="text-muted-foreground text-center max-w-2xl">
            Browse our extensive collection of high-quality decals and stickers for every type of motorcycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <Link href={category.slug} key={category.slug}>
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20 group">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <span className="text-sm px-2 py-1 rounded-full bg-secondary/10 text-primary font-medium">
                      {category.count}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
