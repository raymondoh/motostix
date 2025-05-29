import { adminDb } from "@/firebase/admin/firebase-admin-init";

async function fixMissingOnSaleField() {
  try {
    // Get all products
    const snapshot = await adminDb().collection("products").get();

    const updates: Promise<any>[] = [];
    let fixedCount = 0;
    let alreadyHadField = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();

      // Check if onSale field exists
      if (data.onSale === undefined || data.onSale === null) {
        console.log(`Fixing product ${data.name}: adding onSale: false`);

        updates.push(
          doc.ref.update({
            onSale: false
          })
        );
        fixedCount++;
      } else {
        alreadyHadField++;
      }
    });

    if (updates.length > 0) {
      await Promise.all(updates);
      console.log(`✅ Fixed ${fixedCount} products with missing onSale field`);
    } else {
      console.log("ℹ️ All products already have onSale field");
    }

    return {
      success: true,
      fixed: fixedCount,
      alreadyHadField: alreadyHadField,
      total: snapshot.docs.length,
      message: `Fixed ${fixedCount} products, ${alreadyHadField} already had the field`
    };
  } catch (error) {
    console.error("Error fixing onSale field:", error);

    // Handle unknown error type properly
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return {
      success: false,
      error: errorMessage
    };
  }
}

export default async function FixMissingOnSaleFieldPage() {
  const result = await fixMissingOnSaleField();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Fix Missing onSale Field</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Auto-Fix Results</h2>

        {result.success ? (
          <div className="text-green-600">
            <p className="text-lg">✅ Success!</p>
            <p>{result.message}</p>
            <div className="mt-4 space-y-2">
              <p>
                <strong>Total products:</strong> {result.total}
              </p>
              <p>
                <strong>Fixed:</strong> {result.fixed}
              </p>
              <p>
                <strong>Already had field:</strong> {result.alreadyHadField}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-red-600">
            <p className="text-lg">❌ Error</p>
            <p>{result.error}</p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">What This Does</h2>
        <div className="space-y-2 text-sm">
          <p>1. ✅ Scans all products in the database</p>
          <p>
            2. ✅ Finds products missing the <code>onSale</code> field
          </p>
          <p>
            3. ✅ Sets <code>onSale: false</code> for those products
          </p>
          <p>
            4. ✅ Leaves existing <code>onSale</code> values unchanged
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Refresh this page to run the script again, or check your Firebase console to see the
          updates.
        </p>
      </div>
    </div>
  );
}
