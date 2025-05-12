import Image from "next/image";
import Link from "next/link";

export default function StickerGridSections() {
  return (
    <section className="py-16 w-full bg-secondary/5">
      <div className="container mx-auto px-4 space-y-24">
        {/* First Grid Section - Style Your Ride */}
        <div>
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Style Your Ride</h2>
            <div className="w-12 h-0.5 bg-primary mb-6"></div>
            <p className="text-muted-foreground text-center max-w-2xl">
              Express your personality with our premium quality stickers designed for cars and bikes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Car with sticker image */}
            <div className="rounded-xl overflow-hidden bg-background relative group h-64 md:h-72 shadow-sm">
              <Image
                src="/car.jpg"
                alt="Car with sticker"
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <h3 className="text-white text-xl font-bold">Car Stickers</h3>
                <Link
                  href="/category/car-stickers"
                  className="text-white/80 hover:text-white text-sm inline-flex items-center mt-1">
                  Shop Now <span className="ml-1">→</span>
                </Link>
              </div>
            </div>

            {/* Sticker-like div */}
            <div className="rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center p-6 transform rotate-1 hover:rotate-0 transition-all duration-300 h-64 md:h-72 shadow-sm">
              <p className="text-white text-3xl md:text-4xl font-bold text-center leading-tight">I ❤️ My Car</p>
            </div>

            {/* Bike with sticker image */}
            <div className="rounded-xl overflow-hidden bg-background relative group h-64 md:h-72 shadow-sm">
              <Image
                src="/bike.jpg"
                alt="Bike with sticker"
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <h3 className="text-white text-xl font-bold">Bike Stickers</h3>
                <Link
                  href="/category/bike-stickers"
                  className="text-white/80 hover:text-white text-sm inline-flex items-center mt-1">
                  Shop Now <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Second Grid Section - Express Yourself */}
        <div>
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Express Yourself</h2>
            <div className="w-12 h-0.5 bg-primary mb-6"></div>
            <p className="text-muted-foreground text-center max-w-2xl">
              Find the perfect design to showcase your unique style and personality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sticker-like div */}
            <div className="md:col-span-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center p-8 transform -rotate-1 hover:rotate-0 transition-all duration-300 h-80 shadow-sm">
              <p className="text-white text-3xl md:text-4xl font-bold text-center leading-tight">Born to Ride 🏍️</p>
            </div>

            {/* Large bike image */}
            <div className="md:col-span-8 rounded-xl overflow-hidden bg-background relative h-80 group shadow-sm">
              <Image
                src="/bike.jpg"
                alt="Custom bike stickers"
                width={800}
                height={500}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-white text-xl font-bold">Custom Designs</h3>
                <Link href="/custom" className="text-white/80 hover:text-white text-sm inline-flex items-center mt-2">
                  Create Your Own <span className="ml-1">→</span>
                </Link>
              </div>
            </div>

            {/* Small car image */}
            <div className="md:col-span-6 rounded-xl overflow-hidden bg-background relative h-80 group shadow-sm">
              <Image
                src="/car.jpg"
                alt="Vintage car sticker"
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-white text-xl font-bold">Vintage Collection</h3>
                <Link
                  href="/category/vintage"
                  className="text-white/80 hover:text-white text-sm inline-flex items-center mt-2">
                  Explore <span className="ml-1">→</span>
                </Link>
              </div>
            </div>

            {/* Sticker-like div */}
            <div className="md:col-span-6 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center p-8 transform rotate-1 hover:rotate-0 transition-all duration-300 h-80 shadow-sm">
              <p className="text-white text-3xl md:text-4xl font-bold text-center leading-tight">Drive Different 🚗</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
