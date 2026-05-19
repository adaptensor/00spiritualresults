import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

/**
 * Get the Clerk user ID for the current request, or redirect to sign-in if not
 * authenticated. Use in server components for protected routes.
 */
export async function requireUserId(): Promise<string> {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    redirectToSignIn();
    throw new Error("unreachable");
  }
  return userId;
}

/**
 * Get-or-create the Prisma User row for the currently signed-in Clerk user.
 * Call this on the first authenticated page load to mirror the Clerk identity
 * into our DB. Returns the local User row.
 */
export async function getOrCreateLocalUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Clerk user has no email address");
  }

  return db.user.upsert({
    where: { clerkUserId: clerkUser.id },
    update: {
      email,
      name:
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
      imageUrl: clerkUser.imageUrl || null,
    },
    create: {
      clerkUserId: clerkUser.id,
      email,
      name:
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
      imageUrl: clerkUser.imageUrl || null,
    },
  });
}
