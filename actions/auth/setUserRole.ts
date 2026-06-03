"use server";

import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isSuperAdminSession } from "./isSuperAdminSession";
import { revalidatePath } from "next/cache";

export const setUserRole = async (userId: string, role: "admin") => {
  const isSuperAdmin = await isSuperAdminSession();

  if (!isSuperAdmin.isLoggedIn) {
    throw new Error("Unauthorized");
  }

  await db
    .update(user)
    .set({ role })
    .where(eq(user.id, userId));

  revalidatePath("/admin/users");
};
