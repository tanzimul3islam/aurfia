import { getAllUsers } from "@/actions/auth/getUsers";
import UsersTable from "@/components/users/UsersTable";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-[32px] tracking-[-0.01em]">Manage Users</h1>
          <p className="text-neutral-600 mt-1">
            Promote users to admin, view user details, and manage access levels.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white border border-black/10 px-5 py-3">
          <p className="text-xs text-neutral-500 uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-medium mt-0.5">{users?.length || 0}</p>
        </div>
      </div>

      <div className="bg-white border border-black/10">
        {users && users.length > 0 ? (
          <UsersTable users={users} />
        ) : (
          <div className="text-center py-16 text-neutral-500">
            No users registered yet.
          </div>
        )}
      </div>
    </div>
  );
}
