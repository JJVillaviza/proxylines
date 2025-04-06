import { clientValidation, loginValidation } from "@/types/validation";
import type { Context } from "@/utilities/context";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as schemas from "@/database/schemas";
import type { SuccessResponse } from "@/types/response";
import { db } from "@/database";
import { DatabaseError } from "pg";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

const route = new Hono<Context>()

  // Base path
  .basePath("/api/client")

  // TODO: POST /register
  .post("/register", zValidator("form", clientValidation), async (c) => {
    const {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      username,
      password,
    } = c.req.valid("form");
    const hash = await Bun.password.hash(password);
    const id = crypto.randomUUID();

    try {
      const result = await db.transaction(async (tx) => {
        const [account] = await tx
          .insert(schemas.accountTable)
          .values({ id, username, password: hash, type: "client" })
          .returning();

        const [client] = await tx
          .insert(schemas.clientTable)
          .values({
            id,
            firstName,
            middleName,
            lastName,
            phoneNumber,
            email,
            accountId: id,
          })
          .returning();

        return { account, client };
      });

      return c.json<SuccessResponse<{ username: string }>>(
        {
          success: true,
          message: "Successfully created account!",
          data: { username: result.account.username },
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
  })

  // TODO: POST /login
  .post("/login", zValidator("form", loginValidation), async (c) => {
    const { username, password } = c.req.valid("form");

    const [account] = await db
      .select()
      .from(schemas.accountTable)
      .where(eq(schemas.accountTable.username, username))
      .limit(1);
    if (!account) {
      throw new HTTPException(401, {
        message: "Incorrect credentials",
        cause: { form: true },
      });
    }

    const valid = await Bun.password.verify(password, account.password);
    if (!valid) {
      throw new HTTPException(401, {
        message: "Incorrect credentials!",
        cause: { form: true },
      });
    }

    return c.json<SuccessResponse>(
      {
        success: true,
        message: "Successfully login!",
      },
      200
    );
  })

  // TODO: GET /logout
  .get("/logout", async (c) => {
    return c.json<SuccessResponse>(
      {
        success: true,
        message: "Successfully logout!",
      },
      200
    );
  })

  // TODO: GET /me
  .get("/me", async (c) => {
    return c.json<SuccessResponse>(
      {
        success: true,
        message: "You're details!",
      },
      200
    );
  });

export default route;
