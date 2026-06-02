import { getAllUsers } from "@/actions/auth/getUsers";
import UsersTable from "@/components/users/UsersTable";
import Link from "next/link";

export default async function CreateAdminPage() {
  const users = await getAllUsers();

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
        <p className="mt-1 text-gray-600">
          Promote users to admin, view user details, and manage access levels.
        </p>
      </div>

      {/* Stats / Info Bar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-xl bg-white border p-4 shadow-sm w-fit">
          <p className="text-gray-500 text-sm">Total Users</p>
          <p className="text-xl font-semibold">{users?.length || 0}</p>
        </div>

        <Link
          href="/admin"
          className="rounded-xl bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition-all"
        >
          Go to Admin Dashboard
        </Link>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border bg-white p-6 shadow-xl">
        {users && users.length > 0 ? (
          <UsersTable users={users} />
        ) : (
          <div className="text-center py-16 text-gray-500 text-lg">
            No users registered yet.
          </div>
        )}
      </div>
    </div>
  );
}
