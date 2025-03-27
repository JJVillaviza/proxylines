import { db } from "@/database";
import * as schemas from "@/database/schemas";

export async function CreateSession(token: string, userId: string) {
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 10);

  await db
    .insert(schemas.sessionTable)
    .values({
      id,
      accountId: userId,
      token,
      expiresAt,
    })
    .execute();
}
