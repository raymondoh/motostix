import { adminDb } from "@/firebase/admin/firebase-admin-init";
import { getOnSaleProducts } from "@/firebase/admin/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getAllProductsWithSaleInfo() {
  try {
    const snapshot = await adminDb.collection("products").orderBy("updatedAt", "desc").get();

    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        price: data.price,
        salePrice: data.salePrice,
        onSale: data.onSale,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || "No timestamp",
        createdAt: data.createdAt?.toDate?.()?.toISOString() || "No timestamp"
      };
    });

    return { success: true, data: products };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default async function SaleProductsDetailedPage() {
  const fetchTime = new Date().toISOString();

  // Get both the function result and raw data
  const [functionResult, rawData] = await Promise.all([
    getOnSaleProducts(20), // Get more to see all
    getAllProductsWithSaleInfo()
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sale Products Detailed Debug</h1>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p>
          <strong>Data fetched at:</strong> {fetchTime}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Function Result */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">getOnSaleProducts() Result</h2>
          <div className="space-y-2">
            <p>
              <strong>Success:</strong> {functionResult.success ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Count:</strong> {functionResult.success ? functionResult.data.length : 0}
            </p>
            {!functionResult.success && (
              <p className="text-red-600">
                <strong>Error:</strong> {functionResult.error}
              </p>
            )}
          </div>

          {functionResult.success && functionResult.data.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Products from getOnSaleProducts():</h3>
              <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
                {functionResult.data.map(product => (
                  <div key={product.id} className="p-2 bg-gray-50 rounded">
                    <p>
                      <strong>Name:</strong> {product.name}
                    </p>
                    <p>
                      <strong>Price:</strong> £{product.price}
                    </p>
                    <p>
                      <strong>Sale Price:</strong> {product.salePrice ? `£${product.salePrice}` : "None"}
                    </p>
                    <p>
                      <strong>On Sale:</strong> {product.onSale ? "✅ Yes" : "❌ No"}
                    </p>
                    <p className="text-xs text-gray-500">ID: {product.id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Raw Database Data */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">All Products (Raw Database)</h2>
          <div className="space-y-2">
            <p>
              <strong>Success:</strong> {rawData.success ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Total Count:</strong> {rawData.success ? rawData.data.length : 0}
            </p>
            <p>
              <strong>On Sale Count:</strong> {rawData.success ? rawData.data.filter(p => p.onSale === true).length : 0}
            </p>
          </div>

          {rawData.success && rawData.data.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Recent Products (sorted by updatedAt):</h3>
              <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
                {rawData.data.slice(0, 10).map(product => (
                  <div
                    key={product.id}
                    className={`p-2 rounded ${product.onSale ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}>
                    <p>
                      <strong>Name:</strong> {product.name}
                    </p>
                    <p>
                      <strong>Price:</strong> £{product.price}
                    </p>
                    <p>
                      <strong>Sale Price:</strong> {product.salePrice ? `£${product.salePrice}` : "None"}
                    </p>
                    <p>
                      <strong>On Sale:</strong> {product.onSale ? "✅ Yes" : "❌ No"}
                    </p>
                    <p className="text-xs text-gray-500">Updated: {product.updatedAt}</p>
                    <p className="text-xs text-gray-500">ID: {product.id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Look for specific product */}
      {rawData.success && (
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Looking for "Rugged Hauler"</h2>
          {(() => {
            const ruggedProduct = rawData.data.find(p => p.name.toLowerCase().includes("rugged"));
            if (ruggedProduct) {
              return (
                <div className="p-4 bg-white rounded border">
                  <p>
                    <strong>✅ Found:</strong> {ruggedProduct.name}
                  </p>
                  <p>
                    <strong>Price:</strong> £{ruggedProduct.price}
                  </p>
                  <p>
                    <strong>Sale Price:</strong> {ruggedProduct.salePrice ? `£${ruggedProduct.salePrice}` : "None"}
                  </p>
                  <p>
                    <strong>On Sale:</strong> {ruggedProduct.onSale ? "✅ Yes" : "❌ No"}
                  </p>
                  <p>
                    <strong>Updated:</strong> {ruggedProduct.updatedAt}
                  </p>
                  <p>
                    <strong>ID:</strong> {ruggedProduct.id}
                  </p>
                </div>
              );
            } else {
              return <p className="text-red-600">❌ "Rugged Hauler" product not found in database</p>;
            }
          })()}
        </div>
      )}
    </div>
  );
}
