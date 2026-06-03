"use client";

import { useTransition } from "react";
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
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full bg-black text-white">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-5 py-3 text-left">ID</th>
            <th className="px-5 py-3 text-left">Name</th>
            <th className="px-5 py-3 text-left">Email</th>
            <th className="px-5 py-3 text-left">Role</th>
            <th className="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-gray-800">
              <td className="px-5 py-3">{u.id}</td>
              <td className="px-5 py-3">{u.name ?? "—"}</td>
              <td className="px-5 py-3">{u.email}</td>
              <td className="px-5 py-3">{u.role ?? "user"}</td>

              <td className="px-5 py-3 text-right">
                {u.role === "admin" ? (
                  <span className="text-green-400 font-semibold">Admin</span>
                ) : (
                  <button
                    disabled={isPending}
                    onClick={() => promote(u.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    {isPending ? "Saving..." : "Make Admin"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
