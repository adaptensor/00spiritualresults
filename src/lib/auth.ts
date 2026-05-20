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

// URL slug for /shrine/[username]. Derived from email-local-part, lowercased,
// stripped to a-z0-9 plus hyphen/underscore, then disambiguated with -2/-3/...
// on collision. Lookup race is benign — at worst two new users in the same
// millisecond would race and one would get a Prisma unique-violation; the next
// sign-in call re-runs this and resolves it.
async function generateUsername(email: string): Promise<string> {
  const local = email.split("@")[0] ?? "";
  let base = local
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  if (base.length < 3) base = `soul-${Math.random().toString(36).slice(2, 6)}`;

  let candidate = base;
  let suffix = 2;
  while (await db.user.findUnique({ where: { username: candidate } })) {
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
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

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;
  const imageUrl = clerkUser.imageUrl || null;

  // Resolve in this order: clerkUserId → email → create. The email fallback
  // handles the case where Clerk creates a fresh user for a re-sign-in (e.g.
  // a Google login when account-linking is off on the Clerk instance) — we
  // want to keep the existing local User row and re-point its clerkUserId.
  const byClerkId = await db.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });
  if (byClerkId) {
    return db.user.update({
      where: { id: byClerkId.id },
      data: {
        email,
        name,
        imageUrl,
        ...(byClerkId.username ? {} : { username: await generateUsername(email) }),
      },
    });
  }

  const byEmail = await db.user.findUnique({ where: { email } });
  if (byEmail) {
    return db.user.update({
      where: { id: byEmail.id },
      data: {
        clerkUserId: clerkUser.id,
        name,
        imageUrl,
        ...(byEmail.username ? {} : { username: await generateUsername(email) }),
      },
    });
  }

  return db.user.create({
    data: {
      clerkUserId: clerkUser.id,
      email,
      name,
      imageUrl,
      username: await generateUsername(email),
    },
  });
}
