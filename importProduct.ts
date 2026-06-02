import { db } from "@/lib/db";
import { products } from "@/db/schema";
import fs from "fs";
import path from "path";

type ProductJSON = {
  id: string;
  name: string;
  slug: string;
  description: string;
  mainImage: string;
  externalUrl: string;
  colors: string[];
  priceCents: number;
  currency: string;
  compareAtCents?: number | null;
  sku?: string | null;
  stock: number;
  featured: boolean;
  categoryId?: string | null;
  updatedAt: string;
  createdAt: string;
};

async function importProducts() {
  const filePath = path.join(__dirname, "latest-silver-products.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const productList: ProductJSON[] = JSON.parse(rawData);

  for (const p of productList) {
    await db.insert(products).values({
      productTitle: p.name,
      sku: p.sku ?? null,
      priceCurrency: p.currency,
      priceAmount: p.priceCents / 100,
      sellingPrice: p.priceCents / 100,
      description: p.description,
      url: p.externalUrl,
    });
    console.log(`Inserted product: ${p.name}`);
  }

  console.log("All products imported successfully!");
}

importProducts()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error importing products:", err);
    process.exit(1);
  });
