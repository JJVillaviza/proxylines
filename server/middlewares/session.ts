import { db } from "@/database";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import * as schemas from "@/database/schemas";
import { eq } from "drizzle-orm";
import type { Context } from "@/utilities/context";

export const SessionMiddleware = createMiddleware<Context>(async (c, next) => {
  const token = getCookie(c, "auth__session") as string;

  if (!token) {
    throw new HTTPException(401, { message: "Unauthorized!, token session" });
  }

  const [session] = await db
    .select()
    .from(schemas.sessionTable)
    .where(eq(schemas.sessionTable.token, token))
    .limit(1);
  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized!, session db" });
  }

  const expiresAt = new Date(session.expiresAt);
  if (expiresAt < new Date()) {
    c.set("session", null);
    c.set("account", null);
    deleteCookie(c, "auth__session");
    await db
      .delete(schemas.sessionTable)
      .where(eq(schemas.sessionTable.accountId, session.accountId));
    throw new HTTPException(401, { message: "Session expires!" });
  }

  const newSessionToken = crypto.randomUUID();
  const extendedExpiresAt = new Date(Date.now() + 1000 * 60 * 10);

  const [updated] = await db
    .update(schemas.sessionTable)
    .set({ token: newSessionToken, expiresAt: extendedExpiresAt })
    .where(eq(schemas.sessionTable.id, session.id))
    .returning();

  const [branch] = await db
    .select()
    .from(schemas.branchTable)
    .where(eq(schemas.branchTable.id, session.accountId))
    .limit(1);

  setCookie(c, "auth__session", newSessionToken);

  c.set("session", updated);
  c.set("account", branch);

  return next();
});
