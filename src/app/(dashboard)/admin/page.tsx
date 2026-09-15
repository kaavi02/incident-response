import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getUsers } from "@/actions/admin";
import CreateUserForm from "@/components/CreateUserForm";
import AdminUserRow from "@/components/AdminUserRow";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // RBAC: Only allow ADMIN users to access this page
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/"); // Or a 403 page
  }

  const users = await getUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-headline-xl font-headline-xl text-on-surface tracking-tight font-bold mb-2">
          Admin Settings & User Management
        </h1>
        <p className="text-on-surface-variant text-body-md">
          Provision new responder accounts and manage system roles.
        </p>
      </div>

      <CreateUserForm />

      <section className="bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl overflow-hidden backdrop-blur-md">
        <div className="border-b border-outline-variant/30 bg-surface-container/30 px-5 py-4">
          <h2 className="text-headline-md font-headline-md font-semibold text-on-surface">
            Provisioned Personnel
          </h2>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-telemetry-sm font-label-caps text-on-surface-variant bg-surface-container/10">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Joined Date</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {users.map((u) => (
                <AdminUserRow 
                  key={u.id} 
                  user={u} 
                  currentUserId={(session?.user as any)?.id} 
                />
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-on-surface-variant">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
