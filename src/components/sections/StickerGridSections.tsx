import Image from "next/image";
import Link from "next/link";

export default function StickerGridSections() {
  return (
    <div className="container px-4 py-10 mx-auto space-y-20 bg-secondary/5">
      {/* First Grid Section - Style Your Ride (height reduced by ~20%) */}
      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Style Your Ride</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Car with sticker image - height reduced */}
          <div className="rounded-3xl overflow-hidden bg-slate-100 relative group h-64 md:h-72">
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

          {/* Sticker-like div - height reduced */}
          <div className="rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center p-6 transform rotate-3 shadow-lg hover:rotate-0 transition-all duration-300 h-64 md:h-72">
            <p className="text-white text-3xl md:text-4xl font-bold text-center leading-tight">I ❤️ My Car</p>
          </div>

          {/* Bike with sticker image - height reduced */}
          <div className="rounded-3xl overflow-hidden bg-slate-100 relative group h-64 md:h-72">
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
      </section>

      {/* Second Grid Section */}
      {/* Second Grid Section - Express Yourself (heights made consistent) */}
      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Express Yourself</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sticker-like div - height adjusted to match bottom row */}
          <div className="md:col-span-4 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center p-8 transform -rotate-2 shadow-lg hover:rotate-0 transition-all duration-300 h-80">
            <p className="text-white text-3xl md:text-4xl font-bold text-center leading-tight">Born to Ride 🏍️</p>
          </div>

          {/* Large bike image - height adjusted to match bottom row */}
          <div className="md:col-span-8 rounded-3xl overflow-hidden bg-slate-100 relative h-80 group">
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

          {/* Small car image - already h-80 */}
          <div className="md:col-span-6 rounded-3xl overflow-hidden bg-slate-100 relative h-80 group">
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

          {/* Sticker-like div - already h-80 (implicitly) */}
          <div className="md:col-span-6 rounded-3xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center p-8 transform rotate-1 shadow-lg hover:rotate-0 transition-all duration-300 h-80">
            <p className="text-white text-3xl md:text-4xl font-bold text-center leading-tight">Drive Different 🚗</p>
          </div>
        </div>
      </section>
    </div>
  );
}
