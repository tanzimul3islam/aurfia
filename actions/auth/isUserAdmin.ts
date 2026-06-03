"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const isUserAdmin = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user?.role === "admin";
};
