import { db } from "@/database";
import type { Context, Transaction } from "@/utilities/context";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";
import * as schemas from "@/database/schemas";
import type { SuccessResponse } from "@/types/response";
import { zValidator } from "@hono/zod-validator";
import { idValidation, transactionValidation } from "@/types/validation";
import { eq } from "drizzle-orm";

const route = new Hono<Context>()

  // Base path
  .basePath("/api/transaction")

  // TODO: POST /create
  .post("/create", async (c) => {
    const id = crypto.randomUUID();

    try {
      const [insert] = await db
        .insert(schemas.transactionTable)
        .values({
          id,
          status: "ongoing",
          serviceId: "09fca755-824f-45af-b74b-cb4dcebadc9f",
          branchId: "e4e5c7b1-edf9-4a36-8dbf-1207b828ee73",
          clientId: "3a145de8-1bb4-4407-8125-5132b16fcf5f",
        })
        .returning();

      return c.json<SuccessResponse<{ id: string; serviceId: string }>>(
        {
          success: true,
          message: "Successfully create transaction!",
          data: {
            id: insert.id,
            serviceId: insert.serviceId,
          },
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
  })

  // TODO: PATCH /update/:id
  .patch(
    "/update/:id",
    zValidator("form", transactionValidation),
    zValidator("param", idValidation),
    async (c) => {
      const { status } = c.req.valid("form");
      const { id } = c.req.valid("param");

      try {
        const [update] = await db
          .update(schemas.transactionTable)
          .set({ status })
          .where(eq(schemas.transactionTable.id, id))
          .returning();

        return c.json<
          SuccessResponse<{ id: string; status: string; serviceId: string }>
        >({
          success: true,
          message: "Successfully updated transaction!",
          data: {
            id: update.id,
            status: update.status as string,
            serviceId: update.serviceId,
          },
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

  // TODO: GET /all
  .get("/all", async (c) => {
    const id = "3a145de8-1bb4-4407-8125-5132b16fcf5f";
    const transactions = await db
      .select()
      .from(schemas.transactionTable)
      .where(eq(schemas.transactionTable.clientId, id));
    if (!transactions) {
      throw new HTTPException(404, { message: "No list!" });
    }

    return c.json<SuccessResponse<Transaction[]>>({
      success: true,
      message: "Transaction list!",
      data: [...transactions],
    });
  })

  // TODO: GET /:id
  .get("/:id", zValidator("param", idValidation), async (c) => {
    const { id } = c.req.valid("param");
    try {
      const [transaction] = await db
        .select()
        .from(schemas.transactionTable)
        .where(eq(schemas.transactionTable.id, id))
        .limit(1);
      if (!transaction) {
        throw new HTTPException(404, { message: "No transaction in record!" });
      }

      return c.json<SuccessResponse<Transaction>>({
        success: true,
        message: `Transaction: ${transaction.id}`,
        data: { ...transaction },
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
  })

  // TODO: DELETE /delete/:id
  .delete("/delete/:id", zValidator("param", idValidation), async (c) => {
    const { id } = c.req.valid("param");

    try {
      const [transaction] = await db
        .delete(schemas.transactionTable)
        .where(eq(schemas.transactionTable.id, id))
        .returning();

      return c.json<SuccessResponse<{ id: string }>>({
        success: true,
        message: "Successfully deleted transaction!",
        data: { id: transaction.id },
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
  });

export default route;
