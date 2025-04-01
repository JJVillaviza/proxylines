import { db } from "@/database";
import * as schemas from "@/database/schemas";
import { SessionMiddleware } from "@/middlewares/session";
import type { SuccessResponse } from "@/types/response";
import {
  branchValidation,
  idValidation,
  registerValidation,
} from "@/types/validation";
import type { Account, Context } from "@/utilities/context";
import { zValidator } from "@hono/zod-validator";
import { and, eq, ne } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";

const route = new Hono<Context>()

  // Base path
  .basePath("/api/branch")

  // TODO: POST /create branch
  .post(
    "/create",
    SessionMiddleware,
    zValidator("form", registerValidation),
    async (c) => {
      const { name, email, username, password } = c.req.valid("form");
      const hash = await Bun.password.hash(password);
      const id = crypto.randomUUID();
      const login = c.get("account")!;

      try {
        const register = await db.transaction(async (tx) => {
          const [account] = await tx
            .insert(schemas.accountTable)
            .values({ id, username, password: hash, type: "company" })
            .returning();

          const [branch] = await tx
            .insert(schemas.branchTable)
            .values({
              id,
              name,
              role: "branch",
              email,
              accountId: id,
              companyId: login.companyId,
            })
            .returning();

          return { account, branch };
        });

        return c.json<SuccessResponse<{ name: string; username: string }>>(
          {
            success: true,
            message: "Successfully created branch!",
            data: {
              name: register.branch.name,
              username: register.account.username,
            },
          },
          201
        );
      } catch (error) {
        if (error instanceof DatabaseError && error.code === "23505") {
          throw new HTTPException(409, {
            message: "Username is already used!",
            cause: { form: true },
          });
        }
        throw new HTTPException(500, { message: "Failed to create account!" });
      }
    }
  )

  // TODO: GET /all branches
  .get("/all", SessionMiddleware, async (c) => {
    const account = c.get("account")!;

    if (account.role !== "main") {
      throw new HTTPException(401, { message: "Unauthorized! not main" });
    }

    const [branches] = await db
      .select()
      .from(schemas.branchTable)
      .where(
        and(
          eq(schemas.branchTable.id, account.accountId),
          ne(schemas.branchTable.role, "main")
        )
      );

    return c.json<SuccessResponse<Account[]>>({
      success: true,
      message: "Branches",
      data: [branches],
    });
  })

  // TODO: GET /:id details of login branch
  .get(
    "/:id",
    SessionMiddleware,
    zValidator("param", idValidation),
    async (c) => {
      const { id } = c.req.valid("param");

      const [branch] = await db
        .select()
        .from(schemas.branchTable)
        .where(eq(schemas.branchTable.id, id))
        .limit(1);
      if (!branch) {
        throw new HTTPException(404, { message: "No branch listed!" });
      }

      return c.json<SuccessResponse<Account>>({
        success: true,
        message: "Branch details",
        data: { ...branch },
      });
    }
  )

  // TODO: PATCH /update/:id details of login branch
  .patch(
    "/update/:id",
    SessionMiddleware,
    zValidator("form", branchValidation),
    zValidator("param", idValidation),
    async (c) => {
      const { name, email, role, companyId, accountId } = c.req.valid("form");
      const { id } = c.req.valid("param");

      try {
        const [result] = await db
          .update(schemas.branchTable)
          .set({ name, email, role, companyId, accountId })
          .where(eq(schemas.branchTable.id, id))
          .returning({ name: schemas.branchTable.name });

        return c.json<SuccessResponse<{ name: string }>>({
          success: true,
          message: "Successfully updated!",
          data: { ...result },
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

  // TODO: DELETE /delete/:id branch
  .delete(
    "/delete/:id",
    SessionMiddleware,
    zValidator("param", idValidation),
    async (c) => {
      const { id } = c.req.valid("param");
      const account = c.get("account")!;

      if (account.role !== "main") {
        throw new HTTPException(401, { message: "Unauthorized!" });
      }

      try {
        const [deletedBranch] = await db
          .delete(schemas.branchTable)
          .where(
            and(
              eq(schemas.branchTable.id, id),
              ne(schemas.branchTable.role, "main"),
              eq(schemas.branchTable.companyId, account.companyId!)
            )
          )
          .returning({ name: schemas.branchTable.name });

        const [deletedAccount] = await db
          .delete(schemas.accountTable)
          .where(eq(schemas.accountTable.id, id))
          .returning({ username: schemas.accountTable.username });

        return c.json<SuccessResponse<{ username: string; name: string }>>({
          success: true,
          message: "Successfully deleted branch!",
          data: { username: deletedAccount.username, name: deletedBranch.name },
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
