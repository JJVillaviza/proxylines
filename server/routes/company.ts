import { db } from "@/database";
import { SessionMiddleware } from "@/middlewares/session";
import {
  companyUpdateValidation,
  companyValidation,
  idValidation,
} from "@/types/validation";
import type { Company, Context } from "@/utilities/context";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";
import * as schemas from "@/database/schemas";
import type { SuccessResponse } from "@/types/response";
import { eq } from "drizzle-orm";
import { AccountMiddleware } from "@/middlewares/account";

const route = new Hono<Context>()

  // Base path
  .basePath("/api/company")

  // TODO: /create company details
  .post(
    "/create",
    SessionMiddleware,
    AccountMiddleware,
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

  // TODO: /update company details
  .patch(
    "/update",
    SessionMiddleware,
    AccountMiddleware,
    zValidator("form", companyUpdateValidation),
    async (c) => {
      const { businessName, brandName, description, vision, mission } =
        c.req.valid("form");
      const account = c.get("account")!;

      try {
        const [result] = await db.transaction(async (tx) => {
          const [select] = await tx
            .select()
            .from(schemas.companyTable)
            .where(eq(schemas.companyTable.id, account.companyId))
            .limit(1);
          if (!select) {
            throw new HTTPException(404, { message: "No company found!" });
          }

          return await tx
            .update(schemas.companyTable)
            .set({ businessName, brandName, description, vision, mission })
            .where(eq(schemas.companyTable.id, account.companyId))
            .returning();
        });

        return c.json<SuccessResponse<Company>>(
          {
            success: true,
            message: "Successfully updated details!",
            data: { ...result },
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

  // TODO: /delete company details
  .delete("/delete", SessionMiddleware, AccountMiddleware, async (c) => {
    const account = c.get("account")!;

    try {
      const [deleted] = await db.transaction(async (tx) => {
        const [branch] = await tx
          .delete(schemas.branchTable)
          .where(eq(schemas.branchTable.companyId, account.companyId))
          .returning({ id: schemas.branchTable.accountId });
        await tx
          .delete(schemas.accountTable)
          .where(eq(schemas.accountTable.id, branch.id));

        return tx
          .delete(schemas.companyTable)
          .where(eq(schemas.companyTable.id, account.companyId))
          .returning({ company: schemas.companyTable.businessName });
      });

      return c.json<SuccessResponse<{ company: string }>>({
        success: true,
        message: "Successfully deleted company!",
        data: { company: deleted.company },
      });
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new HTTPException(409, {
          message: `${error.code}, ${error.message}`,
        });
      }
      throw new HTTPException(500, { message: "Internal server error!" });
    }
  })

  // TODO: /:id company details
  .get(
    "/:id",
    SessionMiddleware,
    zValidator("param", idValidation),
    async (c) => {
      const { id } = c.req.valid("param");

      try {
        const [company] = await db
          .select()
          .from(schemas.companyTable)
          .where(eq(schemas.companyTable.id, id))
          .limit(1);

        if (!company) {
          throw new HTTPException(404, { message: "No company selected!" });
        }

        return c.json<SuccessResponse<Company>>({
          success: true,
          message: "Company fetch!",
          data: { ...company },
        });
      } catch (error) {
        if (error instanceof DatabaseError) {
          throw new HTTPException(409, {
            message: `${error.code}, ${error.message}`,
          });
        }
        throw new HTTPException(500, {
          message: "Internal server error!",
        });
      }
    }
  );

export default route;
