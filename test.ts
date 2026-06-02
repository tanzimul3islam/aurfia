import { db } from "@/lib/db";
import { orders, orderItem, products, categories } from "@/db/schema";
import { randomUUID } from "crypto";

async function seed() {
  // Create a dummy category first
  const catId = randomUUID();
  await db.insert(categories).values({ id: catId, name: "Default", slug: "default" }).onConflictDoNothing();

  // Example products
  const sampleProducts = [
    {
      id: randomUUID(),
      name: "T-Shirt",
      slug: "t-shirt",
      description: "A cool T-Shirt",
      priceCents: 2000,
      categoryId: catId,
    },
    {
      id: randomUUID(),
      name: "Hoodie",
      slug: "hoodie",
      description: "A warm hoodie",
      priceCents: 5000,
      categoryId: catId,
    },
    {
      id: randomUUID(),
      name: "Cap",
      slug: "cap",
      description: "A stylish cap",
      priceCents: 1500,
      categoryId: catId,
    },
    {
      id: randomUUID(),
      name: "Sneakers",
      slug: "sneakers",
      description: "Comfortable sneakers",
      priceCents: 8000,
      categoryId: catId,
    },
    {
      id: randomUUID(),
      name: "Backpack",
      slug: "backpack",
      description: "A sturdy backpack",
      priceCents: 4000,
      categoryId: catId,
    },
  ];

  // Insert products
  await Promise.all(sampleProducts.map((p) => db.insert(products).values(p).onConflictDoNothing()));

  // Create 10 sample orders
  for (let i = 0; i < 10; i++) {
    const orderId = randomUUID();
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // last 30 days
    const email = `customer${i}@example.com`;
    const total = Math.floor(Math.random() * 200) + 20;

    // Insert order
    await db.insert(orders).values({
      id: orderId,
      email,
      total,
      currency: "USD",
      status: "pending",
      createdAt,
    });

    // Add 1–3 items per order
    const itemCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < itemCount; j++) {
      const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;

      await db.insert(orderItem).values({
        orderId,
        productId: product.id,
        name: product.name,
        price: product.priceCents,
        quanitity: quantity, // your typo
      });
    }
  }

  console.log("Seed data inserted!");
}

seed().catch((err) => console.error(err));
