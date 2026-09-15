"use server";

import { PrismaClient, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordRaw: string;
  role: string;
}) {
  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("User with this email already exists");
  }

  // Create user
  // (In a real app, hash password using bcrypt here!)
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.passwordRaw, // WARNING: Store plaintext ONLY for prototyping.
      role: data.role as Role,
    },
  });

  revalidatePath("/admin");
  return user;
}

export async function deleteUser(userId: string) {
  // Prevent deleting the only admin or something similar if needed
  await prisma.user.delete({
    where: { id: userId },
  });
  
  revalidatePath("/admin");
  return true;
}
