import { db } from "@/database";
import { SessionMiddleware } from "@/middlewares/session";
import {
  companyUpdateValidation,
  companyValidation,
  idValidation,
} from "@/types/validation";
import type { Context } from "@/utilities/context";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";
import * as schemas from "@/database/schemas";
import type { SuccessResponse } from "@/types/response";
import { and, eq } from "drizzle-orm";

const route = new Hono<Context>()

  // TODO: /create company details
  .post(
    "/create",
    SessionMiddleware,
    zValidator("form", companyValidation),
    async (c) => {
      const { businessName, brandName, description, vision, mission } =
        c.req.valid("form");
      const account = c.get("account")!;

      try {
        const [insert] = await db
          .insert(schemas.companyTable)
          .values({
            id: account.companyId,
            businessName,
            brandName,
            description,
            vision,
            mission,
          })
          .returning({ brandName: schemas.companyTable.brandName });

        return c.json<SuccessResponse<{ brand_name: string }>>(
          {
            success: true,
            message: "Successfully created!",
            data: { brand_name: insert.brandName },
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
          message: "Internal server error",
          cause: { form: true },
        });
      }
    }
  )

  // TODO: /update/:id company details
  .patch(
    "/update/:id",
    SessionMiddleware,
    zValidator("form", companyUpdateValidation),
    zValidator("param", idValidation),
    async (c) => {
      const { businessName, brandName, description, vision, mission } =
        c.req.valid("form");
      const { id } = c.req.valid("param");
      const account = c.get("account")!;

      if (account.role === "branch") {
        throw new HTTPException(401, { message: "Unauthorized!" });
      }

      try {
        const [updated] = await db
          .update(schemas.companyTable)
          .set({ businessName, brandName, description, vision, mission })
          .where(
            and(
              eq(schemas.companyTable.id, id),
              eq(schemas.companyTable.id, account.companyId)
            )
          )
          .returning();

        return c.json<SuccessResponse<typeof updated>>(
          {
            success: true,
            message: "Successfully updated details!",
            data: { ...updated },
          },
          200
        );
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
  )

  // TODO: /delete/:id company details
  .delete(
    "/delete/:id",
    SessionMiddleware,
    zValidator("param", idValidation),
    async (c) => {
      const { id } = c.req.valid("param");
      const account = c.get("account")!;

      if (account.accountId !== id && account.role !== "main") {
        throw new HTTPException(409, { message: "Unauthorized!" });
      }
    }
  )

  // TODO: /:id company details
  .get();

export default route;
