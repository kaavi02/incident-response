"use client";

import { useState } from "react";
import { createUser } from "@/actions/admin";

import { toast } from "react-hot-toast";

export default function CreateUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("L1");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUser({
        name,
        email,
        passwordRaw: password,
        role,
      });
      toast.success("User created successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (e: any) {
      toast.error("Error: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-surface-container-low/50 rounded-xl border border-outline-variant/30">
      <h3 className="text-body-lg font-headline-sm font-semibold text-on-surface mb-2">Provision New User</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-telemetry-sm font-label-caps text-on-surface-variant mb-1.5">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-4 py-2 text-body-sm focus:border-primary/50"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="block text-telemetry-sm font-label-caps text-on-surface-variant mb-1.5">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-4 py-2 text-body-sm focus:border-primary/50"
            placeholder="jane@aegis.com"
          />
        </div>
        <div>
          <label className="block text-telemetry-sm font-label-caps text-on-surface-variant mb-1.5">Temporary Password</label>
          <input
            type="text"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-4 py-2 text-body-sm focus:border-primary/50"
            placeholder="password123"
          />
        </div>
        <div>
          <label className="block text-telemetry-sm font-label-caps text-on-surface-variant mb-1.5">System Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-4 py-2 text-body-sm focus:border-primary/50"
          >
            <option value="L1">L1 Responder (Triage)</option>
            <option value="L2">L2 Responder (Analysis)</option>
            <option value="L3">L3 Responder (Expert)</option>
            <option value="INCIDENT_RESPONDER">Incident Commander</option>
            <option value="DIGITAL_FORENSICS">Digital Forensics</option>
            <option value="ADMIN">System Administrator</option>
          </select>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[18px]">person_add</span>
        {isLoading ? "Provisioning..." : "Provision Account"}
      </button>
    </form>
  );
}
