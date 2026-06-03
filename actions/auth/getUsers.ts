"use server";

import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { isSuperAdminSession } from "./isSuperAdminSession";
import { isUserAdmin } from "./isUserAdmin";
import { not } from "drizzle-orm";

export const getAllUsers = async () => {
  try {
    const isSuperAdmin = await isSuperAdminSession();
    const isAdmin = await isUserAdmin();

    if (isSuperAdmin.isLoggedIn || isAdmin) {
      const u = await db
        .select()
        .from(user);

      return u;
    }

    return [];
  } catch {
    throw new Error("Internal Server Error");
  }
};
