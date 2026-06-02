import { db } from "@/lib/db";
import { products, productImages, productBreadcrumbs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteProductsByBreadcrumb(breadcrumb: string) {
  const items = await db
    .select({ id: products.id })
    .from(products)
    .innerJoin(productBreadcrumbs, eq(productBreadcrumbs.productId, products.id))
    .where(eq(productBreadcrumbs.breadcrumb, breadcrumb));

  if (items.length === 0) {
    return { success: true, message: "No products found with this breadcrumb" };
  }

  const productIds = items.map((p) => p.id);

  await db.delete(productImages).where(eq(productImages.productId, productIds[0]));
  await db.delete(productBreadcrumbs).where(eq(productBreadcrumbs.productId, productIds[0]));
  await db.delete(products).where(eq(products.id, productIds[0]));

  return {
    success: true,
    message: `Deleted ${items.length} products with breadcrumb '${breadcrumb}'`,
  };
}
