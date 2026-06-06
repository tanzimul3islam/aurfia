import { isSuperAdminSession } from "@/actions/auth/isSuperAdminSession";
import { isUserAdmin } from "@/actions/auth/isUserAdmin";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin - AURFIA",
  description: "Admin area for product and order management",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const superAdmin = await isSuperAdminSession();
  const admin = await isUserAdmin();

  if (!superAdmin.isLoggedIn && !admin) {
    redirect("/");
  }

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 md:px-8">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6 text-sm">
            <Link href="/admin" className="text-zinc-600 hover:text-zinc-900 transition-colors font-medium">Dashboard</Link>
            <Link href="/admin/products" className="text-zinc-600 hover:text-zinc-900 transition-colors">Products</Link>
            <Link href="/admin/media" className="text-zinc-600 hover:text-zinc-900 transition-colors">Media</Link>
            <Link href="/admin/orders" className="text-zinc-600 hover:text-zinc-900 transition-colors">Orders</Link>
            <Link href="/admin/reviews" className="text-zinc-600 hover:text-zinc-900 transition-colors">Reviews</Link>
            <Link href="/admin/marketing" className="text-zinc-600 hover:text-zinc-900 transition-colors">Marketing</Link>
            <Link href="/admin/chatbot" className="text-zinc-600 hover:text-zinc-900 transition-colors">Chatbot</Link>
          </div>
          <Link href="/" className="text-zinc-500 hover:text-zinc-800 transition-colors text-sm">Back to Site →</Link>
        </div>
      </nav>
      <div className="min-h-screen bg-[#FBFAF8] text-[#0E0E0E] pt-16">
        <main className="px-4 md:px-8">{children}</main>
      </div>
    </>
  );
}
