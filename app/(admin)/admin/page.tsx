import Link from "next/link";
import { db } from "@/lib/db";
import { products, orders, reviews, subscribers, user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export default async function AdminHome() {
  const [productCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products);
  const [orderCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders);
  const [pendingCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.status, "pending"));
  const [reviewCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reviews);
  const [subscriberCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(subscribers);
  const [userCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(user);

  const stats = [
    { label: "Products", value: productCount.count, href: "/admin/products/list" },
    { label: "Orders", value: orderCount.count, href: "/admin/orders" },
    { label: "Pending", value: pendingCount.count, href: "/admin/orders" },
    { label: "Reviews", value: reviewCount.count, href: "/admin/reviews" },
    { label: "Subscribers", value: subscriberCount.count, href: "#" },
    { label: "Users", value: userCount.count, href: "/admin-login/create-admin" },
  ];

  return (
    <div className="container py-12">
      <div className="max-w-4xl">
        <h1 className="font-serif text-[32px] tracking-[-0.01em] mb-2">Dashboard</h1>
        <p className="text-neutral-600 mb-10">Overview and quick access to store management.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white border border-black/10 p-5 hover:border-black/20 transition-colors"
            >
              <p className="text-sm text-neutral-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-medium">{stat.value}</p>
            </Link>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/admin/orders" className="bg-white border border-black/10 p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-1">Orders</h3>
            <p className="text-sm text-neutral-500">View and manage customer orders</p>
          </Link>
          <Link href="/admin/products/list" className="bg-white border border-black/10 p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-1">Products</h3>
            <p className="text-sm text-neutral-500">Browse and manage your catalog</p>
          </Link>
          <Link href="/admin/reviews" className="bg-white border border-black/10 p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-1">Reviews</h3>
            <p className="text-sm text-neutral-500">Moderate customer reviews</p>
          </Link>
          <Link href="/admin/marketing" className="bg-white border border-black/10 p-6 hover:border-black/20 transition-colors">
            <h3 className="font-medium mb-1">Marketing</h3>
            <p className="text-sm text-neutral-500">SEO, analytics, and stats</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
