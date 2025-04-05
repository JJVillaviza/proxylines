import { db } from "@/database";
import { serviceTable } from "@/database/schemas";
import type { Context } from "@/utilities/context";
import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const ServiceMiddleware = createMiddleware<Context>(async (c, next) => {
  const service = getCookie(c, "_service_");

  if (!service) {
    c.set("service", null);
    throw new HTTPException(404, { message: "There is service id found!" });
  }

  const [result] = await db
    .select()
    .from(serviceTable)
    .where(eq(serviceTable.id, service))
    .limit(1);

  c.set("service", result);
  return next();
});
