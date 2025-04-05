import { db } from "@/database";
import { SessionMiddleware } from "@/middlewares/session";
import {
  idValidation,
  serviceUpdateValidation,
  serviceValidation,
} from "@/types/validation";
import type { Context, Service } from "@/utilities/context";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as schemas from "@/database/schemas";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { SuccessResponse } from "@/types/response";
import { DatabaseError } from "pg";
import { AccountMiddleware } from "@/middlewares/account";
import { deleteCookie, setCookie } from "hono/cookie";

const route = new Hono<Context>()

  // Base path
  .basePath("/api/service")

  // TODO: POST /create service
  .post(
    "/create",
    SessionMiddleware,
    AccountMiddleware,
    zValidator("form", serviceValidation),
    async (c) => {
      const { name, description, timeStart, timeEnd } = c.req.valid("form");
      const id = crypto.randomUUID();
      const account = c.get("account")!;

      try {
        const [insert] = await db
          .insert(schemas.serviceTable)
          .values({
            id,
            name,
            description,
            timeStart,
            timeEnd,
            companyId: account.companyId,
          })
          .returning();

        return c.json<SuccessResponse<{ name: string }>>({
          success: true,
          message: "Successfully created service!",
          data: { name: insert.name },
        });
      } catch (error) {
        if (error instanceof DatabaseError) {
          throw new HTTPException(409, {
            message: `${error.code}, ${error.message}`,
            cause: { form: true },
          });
        }
        throw new HTTPException(500, {
          message: "Internal server error!",
          cause: { form: true },
        });
      }
    }
  )

  // TODO: PATCH /update/:id service
  .patch(
    "/update/:id",
    SessionMiddleware,
    AccountMiddleware,
    zValidator("form", serviceUpdateValidation),
    zValidator("param", idValidation),
    async (c) => {
      const { name, description, timeStart, timeEnd } = c.req.valid("form");
      const { id } = c.req.valid("param");
      const account = c.get("account")!;

      try {
        const [update] = await db
          .update(schemas.serviceTable)
          .set({ name, description, timeStart, timeEnd })
          .where(
            and(
              eq(schemas.serviceTable.id, id),
              eq(schemas.serviceTable.companyId, account.companyId)
            )
          )
          .returning();

        return c.json<SuccessResponse<{ name: string }>>({
          success: true,
          message: "Successfully updated service!",
          data: { ...update },
        });
      } catch (error) {
        if (error instanceof DatabaseError) {
          throw new HTTPException(409, {
            message: `${error.code}, ${error.message}`,
            cause: { form: true },
          });
        }
        throw new HTTPException(500, {
          message: "Internal server error!",
          cause: { form: true },
        });
      }
    }
  )

  // TODO: GET /all services
  .get("/all", SessionMiddleware, async (c) => {
    const account = c.get("account")!;

    const result = await db
      .select()
      .from(schemas.serviceTable)
      .where(eq(schemas.serviceTable.companyId, account.companyId));
    if (!result) {
      throw new HTTPException(404, {
        message: "No services for this company!",
      });
    }

    deleteCookie(c, "_service_");

    return c.json<SuccessResponse<Service[]>>(
      {
        success: true,
        message: "List of services!",
        data: [...result],
      },
      200
    );
  })

  // TODO: GET /:id service
  .get(
    "/:id",
    SessionMiddleware,
    zValidator("param", idValidation),
    async (c) => {
      const { id } = c.req.valid("param");
      const account = c.get("account")!;

      const [service] = await db
        .select()
        .from(schemas.serviceTable)
        .where(
          and(
            eq(schemas.serviceTable.id, id),
            eq(schemas.serviceTable.companyId, account.companyId)
          )
        )
        .limit(1);
      if (!service) {
        throw new HTTPException(404, { message: "No service!" });
      }

      setCookie(c, "_service_", service.id);

      return c.json<SuccessResponse<Service>>({
        success: true,
        message: "Successfully retrieve service!",
        data: { ...service },
      });
    }
  )

  // TODO: DELETE /delete/:id
  .delete(
    "/delete/:id",
    SessionMiddleware,
    AccountMiddleware,
    zValidator("param", idValidation),
    async (c) => {
      const { id } = c.req.valid("param");
      const account = c.get("account")!;

      try {
        const deleteService = await db.transaction(async (tx) => {
          const [service] = await tx
            .delete(schemas.serviceTable)
            .where(
              and(
                eq(schemas.serviceTable.id, id),
                eq(schemas.serviceTable.companyId, account.companyId)
              )
            )
            .returning();

          const [requirement] = await tx
            .delete(schemas.requirementTable)
            .where(eq(schemas.requirementTable.serviceId, service.id))
            .returning();

          return { service, requirement };
        });

        deleteCookie(c, "_service_");

        return c.json<SuccessResponse<{ service: string }>>({
          success: true,
          message: "Successfully deleted service!",
          data: { service: deleteService.service.name },
        });
      } catch (error) {
        if (error instanceof DatabaseError) {
          throw new HTTPException(409, {
            message: `${error.message} ${error.code}`,
            cause: { form: true },
          });
        }
        throw new HTTPException(500, {
          message: "Internal server error!",
          cause: { form: true },
        });
      }
    }
  );

export default route;
