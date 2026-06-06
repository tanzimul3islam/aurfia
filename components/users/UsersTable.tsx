"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { InferSelectModel } from "drizzle-orm";
import { user } from "@/db/schema";
import { setUserRole } from "@/actions/auth/setUserRole";

type User = InferSelectModel<typeof user>;
export default function UsersTable({ users }: {users: User[]}) {
  const [isPending, startTransition] = useTransition();

  const promote = (id: string) => {
    startTransition(() => {
      setUserRole(id, "admin");
    });
  };

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-black/10 text-neutral-500 text-xs uppercase tracking-wider">
          <th className="px-5 py-3 text-left font-medium">ID</th>
          <th className="px-5 py-3 text-left font-medium">Name</th>
          <th className="px-5 py-3 text-left font-medium">Email</th>
          <th className="px-5 py-3 text-left font-medium">Role</th>
          <th className="px-5 py-3 text-right font-medium">Action</th>
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-b border-black/5 hover:bg-neutral-50">
            <td className="px-5 py-3 text-neutral-500">{u.id}</td>
            <td className="px-5 py-3 font-medium">{u.name ?? "—"}</td>
            <td className="px-5 py-3 text-neutral-600">{u.email}</td>
            <td className="px-5 py-3">
              <span className={`text-xs font-medium px-2 py-0.5 ${u.role === "admin" ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-600"}`}>
                {u.role ?? "user"}
              </span>
            </td>
            <td className="px-5 py-3 text-right">
              {u.role === "admin" ? (
                <span className="text-xs text-green-700 font-medium">Admin</span>
              ) : (
                <button
                  disabled={isPending}
                  onClick={() => promote(u.id)}
                  className="btn btn-sm btn-secondary inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  Make Admin
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
