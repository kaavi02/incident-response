export interface RoleOption {
  value: string;
  label: string;
}

export const SYSTEM_ROLES: RoleOption[] = [
  { value: "USER", label: "Base User" },
  { value: "L1", label: "L1 Triage" },
  { value: "L2", label: "L2 Responder" },
  { value: "L3", label: "L3 Analyst" },
  { value: "RESPONDER", label: "Incident Responder" },
  { value: "INCIDENT_RESPONDER", label: "Incident Commander" },
  { value: "DIGITAL_FORENSICS", label: "Digital Forensics" },
  { value: "ADMIN", label: "System Administrator" },
];

export const ROLE_LABELS: Record<string, string> = {
  USER: "Base User",
  L1: "L1 Triage",
  L2: "L2 Responder",
  L3: "L3 Analyst",
  RESPONDER: "Incident Responder",
  INCIDENT_RESPONDER: "Incident Commander",
  DIGITAL_FORENSICS: "Digital Forensics",
  ADMIN: "System Administrator",
};

export const ROLE_BADGE_STYLES: Record<string, string> = {
  ADMIN: "border-red-500/40 bg-red-500/10 text-red-400",
  DIGITAL_FORENSICS: "border-purple-500/40 bg-purple-500/10 text-purple-400",
  INCIDENT_RESPONDER: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  RESPONDER: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",
  L3: "border-orange-500/40 bg-orange-500/10 text-orange-400",
  L2: "border-teal-500/40 bg-teal-500/10 text-teal-400",
  L1: "border-blue-500/40 bg-blue-500/10 text-blue-400",
  USER: "border-gray-500/40 bg-gray-500/10 text-gray-400",
};
