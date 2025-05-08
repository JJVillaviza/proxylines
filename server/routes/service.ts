import { db } from "@/database";
import * as schemas from "@/database/schemas";
import { AccountMiddleware } from "@/middlewares/account";
import { SessionMiddleware } from "@/middlewares/session";
import type { PaginatedResponse, SuccessResponse } from "@/types/response";
import {
  createServiceSchema,
  idValidation,
  paginationSchema,
  serviceUpdateValidation,
} from "@/types/validation";
import type { Context, Service } from "@/utilities/context";
import { zValidator } from "@hono/zod-validator";
import { and, asc, countDistinct, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";

const route = new Hono<Context>()

  // Base path
  .basePath("/api/service")

  // TODO: POST /create service
  .post(
    "/create",
    SessionMiddleware,
    AccountMiddleware,
    zValidator("form", createServiceSchema),
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

        return c.json<SuccessResponse<{ serviceId: string }>>(
          {
            success: true,
            message: "Successfully created service!",
            data: { serviceId: insert.id },
          },
          201
        );
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
  .get(
    "/all",
    SessionMiddleware,
    zValidator("query", paginationSchema),
    async (c) => {
      const { limit, page, sortBy, orderBy } = c.req.valid("query");
      const account = c.get("account")!;

      const offset = (page - 1) * limit;
      const sortByColumn =
        sortBy === "recent"
          ? schemas.serviceTable.updatedAt
          : schemas.serviceTable.createdAt;
      const sortOrder =
        orderBy === "desc" ? desc(sortByColumn) : asc(sortByColumn);

      const [count] = await db
        .select({
          count: countDistinct(schemas.serviceTable.id),
        })
        .from(schemas.serviceTable)
        .where(eq(schemas.serviceTable.companyId, account.companyId));

      const service = await db.query.serviceTable.findMany({
        limit: limit,
        offset: offset,
        orderBy: sortOrder,
        where: (company, { eq }) => eq(company.companyId, account.companyId),
      });

      return c.json<PaginatedResponse<Service[]>>(
        {
          data: service as Service[],
          success: true,
          message: "Service fetch!",
          pagination: {
            page,
            totalPage: Math.ceil(count.count / limit) as number,
          },
        },
        200
      );
    }
  )

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
