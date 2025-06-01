"use server";

import { db } from "@/db";
import { NewUser, users } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function syncUser() {
  try {
    
    const { userId } = await auth();
    const user = await currentUser();

    if (!user || !userId) {
        
      return;
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId));

    if (existingUser.length > 0) return existingUser;
    const newUser: NewUser = {
      name: `${user.firstName || ""} ${user.lastName || ""}`,
      email: user.emailAddresses[0].emailAddress,
      password: "",
      clerkId: userId,
    };
    const dbUser = await db.insert(users).values(newUser);

    return dbUser;
  } catch (error) {}
}
