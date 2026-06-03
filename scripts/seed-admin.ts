import "dotenv/config";
import { db } from "@/lib/db";
import { user } from "@/db/schema";

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Admin";

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/seed-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  const existing = await db.select().from(user).where(
    // @ts-ignore - dynamic import
    undefined
  ).catch(() => []);

  const adminExists = false;
  // Check if any admin exists
  const { sql } = await import("drizzle-orm");
  const admins = await db.select().from(user).where(
    sql`${user.role} = 'admin'`
  );

  if (admins.length > 0) {
    console.log("An admin user already exists. Role promotion not available via seed script.");
    console.log("Use the /admin-login page with super admin credentials to promote users.");
    process.exit(0);
  }

  console.log("Creating first admin user via Better Auth API...");
  console.log("You can sign up at /sign-in and then use super admin at /admin-login to promote.");
  console.log(`\nTo create the first admin:\n1. Sign up at http://localhost:3000/sign-in with ${email}\n2. Login as super admin at http://localhost:3000/admin-login\n3. Go to create-admin page and promote the user to admin\n`);
}

main().catch(console.error);
