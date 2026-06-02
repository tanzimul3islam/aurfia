import { db } from "@/lib/db";
import { products, productImages, productOptions } from "@/db/schema";

export async function deleteAllProducts() {
  await db.delete(productImages);
  await db.delete(productOptions);
  await db.delete(products);

  return {
    success: true,
    message: "All products and product images have been deleted successfully",
  };
}
