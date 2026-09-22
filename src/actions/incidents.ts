"use server";

import { PrismaClient, EscalationTier, Status, Priority } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { formatIncidentDescription } from "@/lib/incident-parser";

const prisma = new PrismaClient();

export async function getIncidents(filters?: {
  q?: string;
  status?: Status;
  tier?: EscalationTier;
  priority?: Priority;
}) {
  const where: any = {};
  
  if (filters?.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { id: { contains: filters.q, mode: "insensitive" } },
      { sourceIp: { contains: filters.q, mode: "insensitive" } },
      { destinationIp: { contains: filters.q, mode: "insensitive" } }
    ];
  }
  
  if (filters?.status) where.status = filters.status;
  if (filters?.tier) where.tier = filters.tier;
  if (filters?.priority) where.priority = filters.priority;

  return prisma.incident.findMany({
    where,
    include: {
      reporter: true,
      assignee: true,
      comments: {
        include: {
          author: true,
        },
      },
      escalations: {
        include: {
          escalatedBy: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getIncidentById(id: string) {
  return prisma.incident.findUnique({
    where: { id },
    include: {
      reporter: true,
      assignee: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
      escalations: {
        include: { escalatedBy: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function createIncident(data: {
  title: string;
  description: string;
  priority: Priority;
  reporterId: string;
  sourceIp?: string;
  destinationIp?: string;
  sourcePort?: number;
  destinationPort?: number;
  otherInfo?: string;
  logFileName?: string;
  logContent?: string;
}) {
  const fullDescription = formatIncidentDescription({
    description: data.description,
    otherInfo: data.otherInfo,
    logFileName: data.logFileName,
    logContent: data.logContent,
  });

  const incident = await prisma.incident.create({
    data: {
      title: data.title,
      description: fullDescription,
      priority: data.priority,
      reporterId: data.reporterId,
      tier: "L1", // Starts at L1
      sourceIp: data.sourceIp,
      destinationIp: data.destinationIp,
      sourcePort: data.sourcePort,
      destinationPort: data.destinationPort,
    },
  });
  revalidatePath("/");
  revalidatePath("/incidents");
  return incident;
}

export async function escalateIncident(
  incidentId: string,
  userId: string,
  newTier: EscalationTier,
  reason: string
) {
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
  });

  if (!incident) throw new Error("Incident not found");

  const escalation = await prisma.$transaction([
    prisma.escalation.create({
      data: {
        incidentId,
        previousTier: incident.tier,
        newTier,
        reason,
        escalatedById: userId,
      },
    }),
    prisma.incident.update({
      where: { id: incidentId },
      data: { tier: newTier },
    }),
  ]);

  revalidatePath("/");
  return escalation;
}

export async function updateIncidentStatus(incidentId: string, status: Status) {
  const updated = await prisma.incident.update({
    where: { id: incidentId },
    data: { status },
    include: { comments: true }
  });

  if (status === "CLOSED") {
    const timeToResolve = Math.round((new Date().getTime() - new Date(updated.createdAt).getTime()) / 60000);
    const content = `Auto-generated Post-Mortem Draft
Incident ID: ${updated.id}
Title: ${updated.title}
Time to Resolve: ${timeToResolve} minutes

Summary:
[Please summarize the root cause and mitigation steps here]

Action Items:
1. 
2. 

Comments Log:
${updated.comments.map(c => `- ${c.content}`).join("\n")}
`;
    await prisma.postMortem.upsert({
      where: { incidentId },
      update: {},
      create: {
        incidentId,
        content,
        timeToResolve
      }
    });
  }

  revalidatePath("/");
  revalidatePath("/incidents");
  revalidatePath(`/incidents/${incidentId}`);
  return updated;
}

export async function addComment(
  incidentId: string,
  userId: string,
  content: string
) {
  const comment = await prisma.comment.create({
    data: {
      content,
      incidentId,
      authorId: userId,
    },
  });
  revalidatePath("/");
  return comment;
}

export async function getRecentActivity() {
  return prisma.incident.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, status: true, tier: true, updatedAt: true }
  });
}
