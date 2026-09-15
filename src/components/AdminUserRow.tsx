"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { deleteUser, updateUser } from "@/actions/admin";

export default function AdminUserRow({ user, currentUserId }: { user: any, currentUserId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isCurrentUser = user.id === currentUserId;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateUser(user.id, {
        name,
        email,
        role,
        passwordRaw: password || undefined,
      });
      toast.success("User updated successfully!");
      setIsEditing(false);
      setPassword(""); // Clear password field
    } catch (error: any) {
      toast.error(error.message || "Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to completely delete ${user.name || user.email}?`)) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteUser(user.id);
      toast.success("User deleted.");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <tr className="hover:bg-surface-container-low/50 transition-colors">
        <td className="px-5 py-3 text-body-md font-semibold text-on-surface">
          {user.name || "N/A"} {isCurrentUser && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded ml-2">YOU</span>}
        </td>
        <td className="px-5 py-3 text-body-sm text-on-surface-variant">
          {user.email}
        </td>
        <td className="px-5 py-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-label-caps border border-primary/40 bg-primary-container/20 text-primary font-semibold">
            {user.role}
          </span>
        </td>
        <td className="px-5 py-3 text-body-sm text-on-surface-variant" suppressHydrationWarning>
          {new Date(user.createdAt).toLocaleDateString()}
        </td>
        <td className="px-5 py-3 flex gap-3 items-center">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-primary hover:text-primary-fixed text-telemetry-sm font-semibold transition-colors"
          >
            {isEditing ? "Close" : "Edit"}
          </button>
          
          <button 
            onClick={handleDelete}
            disabled={isDeleting || isCurrentUser}
            title={isCurrentUser ? "You cannot delete yourself" : "Delete user"}
            className="text-error hover:text-error/80 text-telemetry-sm font-semibold transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        </td>
      </tr>

      {/* Edit Form Dropdown row */}
      {isEditing && (
        <tr className="bg-surface-container-lowest border-y border-outline-variant/30">
          <td colSpan={5} className="p-6">
            <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
              <h3 className="text-headline-sm font-semibold text-primary">Edit User: {user.email}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-body-sm text-on-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-body-sm text-on-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface mb-1">New Password (Leave blank to keep current)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-body-sm text-on-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-body-sm text-on-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none"
                    disabled={isCurrentUser} // Prevent admins from demoting themselves by accident
                  >
                    <option value="USER">Base User</option>
                    <option value="L1">L1 Triage</option>
                    <option value="L2">L2 Responder</option>
                    <option value="L3">L3 Analyst</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg text-body-sm font-semibold text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-fixed text-on-primary font-semibold text-body-sm disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </td>
        </tr>
      )}
    </>
  );
}
