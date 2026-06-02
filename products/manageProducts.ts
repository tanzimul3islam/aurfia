import { productImages, products } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";
import { writeFile, readFile } from "fs/promises";
import path from "path";

async function manageProducts() {
    // 1. Get all products
    const allProducts = await db.select().from(products);

    // 2. Filter products
    const pro = allProducts.filter(item => item.productTitle?.toLowerCase().includes("925 sterling silver"));

    console.log("Filtered products:", pro);

    // 3. Build JSON file path
    const filePath = path.join(process.cwd(), "latest-silver-products.json");

    // 4. Write JSON file
    await writeFile(filePath, JSON.stringify(pro, null, 2));

    console.log("JSON file created at:", filePath);
}

await manageProducts();







// async function deleteSilverProductsFast() {
//     const filePath = path.join(process.cwd(), "latest-silver-products.json");
//     const jsonData = await readFile(filePath, "utf8");
//     const items = JSON.parse(jsonData);

//     const ids = items.map((item: any) => item.id);

//     console.log("Deleting:", ids.length, "products");

//     // 1️⃣ Delete all related images in one query (fast)
//     await db.delete(productImages).where(inArray(productImages.productId, ids));
//     console.log("All related images deleted.");

//     // 2️⃣ Delete all products in one query (super fast)
//     await db.delete(products).where(inArray(products.id, ids));
//     console.log("All products deleted in one batch!");

//     // 3️⃣ Optional: Log progress in batches for visibility
//     const batchSize = 500;
//     for (let i = 0; i < ids.length; i += batchSize) {
//         const batch = ids.slice(i, i + batchSize);
//         console.log(`Deleted ${Math.min(i + batchSize, ids.length)} of ${ids.length} products`);
//     }

//     console.log("✅ Deletion completed in minutes!");
// }

// await deleteSilverProductsFast();
