import { db } from "@/database";
import { SessionMiddleware } from "@/middlewares/session";
import {
  idValidation,
  requirementUpdateValidation,
  requirementValidation,
} from "@/types/validation";
import type { Context, Requirement } from "@/utilities/context";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";
import * as schemas from "@/database/schemas";
import type { SuccessResponse } from "@/types/response";
import { AccountMiddleware } from "@/middlewares/account";
import { ServiceMiddleware } from "@/middlewares/service";
import { and, eq } from "drizzle-orm";

const route = new Hono<Context>()

  // Base path
  .basePath("/api/requirement")

  // TODO: POST /create requirement
  .post(
    "/create",
    SessionMiddleware,
    AccountMiddleware,
    ServiceMiddleware,
    zValidator("form", requirementValidation),
    async (c) => {
      const { name, description } = c.req.valid("form");
      const id = crypto.randomUUID();
      const service = c.get("service")!;

      try {
        const [insert] = await db
          .insert(schemas.requirementTable)
          .values({ id, name, description, serviceId: service.id })
          .returning();

        return c.json<SuccessResponse<{ name: string }>>({
          success: true,
          message: "Successfully created requirement!",
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

  // TODO: PATCH /update/:id requirement
  .patch(
    "/update/:id",
    SessionMiddleware,
    ServiceMiddleware,
    zValidator("form", requirementUpdateValidation),
    zValidator("param", idValidation),
    async (c) => {
      const { name, description } = c.req.valid("form");
      const { id } = c.req.valid("param");
      const service = c.get("service")!;

      try {
        const [update] = await db
          .update(schemas.requirementTable)
          .set({ name, description })
          .where(
            and(
              eq(schemas.requirementTable.id, id),
              eq(schemas.requirementTable.serviceId, service.id)
            )
          )
          .returning();

        return c.json<SuccessResponse<Requirement>>({
          success: true,
          message: "Successfully updated requirement!",
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

  // TODO: GET /all requirement
  .get("/all", SessionMiddleware, ServiceMiddleware, async (c) => {
    const service = c.get("service")!;

    const services = await db
      .select()
      .from(schemas.requirementTable)
      .where(eq(schemas.requirementTable.serviceId, service.id));
    if (!services) {
      throw new HTTPException(404, {
        message: "No requirement list under this service!",
      });
    }

    return c.json<SuccessResponse<Requirement[]>>({
      success: true,
      message: "List of requirements for this service!",
      data: [...services],
    });
  })

  // TODO: GET /:id requirement
  .get(
    "/:id",
    SessionMiddleware,
    ServiceMiddleware,
    zValidator("param", idValidation),
    async (c) => {
      const { id } = c.req.valid("param");
      const service = c.get("service")!;

      const [requirement] = await db
        .select()
        .from(schemas.requirementTable)
        .where(
          and(
            eq(schemas.requirementTable.id, id),
            eq(schemas.requirementTable.serviceId, service.id)
          )
        )
        .limit(1);
      if (!requirement) {
        throw new HTTPException(404, { message: "No requirement found!" });
      }

      return c.json<SuccessResponse<Requirement>>({
        success: true,
        message: "Details for this requirement!",
        data: { ...requirement },
      });
    }
  )

  // TODO: DELETE /delete/:id requirement
  .delete(
    "/delete/:id",
    SessionMiddleware,
    ServiceMiddleware,
    zValidator("param", idValidation),
    async (c) => {
      const { id } = c.req.valid("param");
      const service = c.get("service")!;

      try {
        const [requirement] = await db
          .delete(schemas.requirementTable)
          .where(
            and(
              eq(schemas.requirementTable.id, id),
              eq(schemas.requirementTable.serviceId, service.id)
            )
          )
          .returning();

        return c.json<SuccessResponse<Requirement>>({
          success: true,
          message: "Successfully deleted requirement!",
          data: { ...requirement },
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
  );

export default route;
