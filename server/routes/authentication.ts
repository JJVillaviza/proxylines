import { db } from "@/database";
import type { SuccessResponse } from "@/types/response";
import { loginValidation, registerValidation } from "@/types/validation";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";
import * as schemas from "@/database/schemas";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { CreateSession } from "@/utilities/session";

const route = new Hono()

  // Base path
  .basePath("/api/account")

  // TODO: POST /register company
  .post("/register", zValidator("form", registerValidation), async (c) => {
    const { name, email, username, password } = c.req.valid("form");
    const hash = await Bun.password.hash(password);
    const id = crypto.randomUUID();

    try {
      await db.insert(schemas.accountTable).values({
        id,
        username,
        password: hash,
        type: "company",
      });

      await db.insert(schemas.branchTable).values({
        id,
        name,
        role: "main",
        email,
        accountId: id,
      });

      return c.json<SuccessResponse>(
        {
          success: true,
          message: "Successfully created account!",
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

  // TODO: POST /login company
  .post("/login", zValidator("form", loginValidation), async (c) => {
    const { username, password } = c.req.valid("form");
    const session = crypto.randomUUID();

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

    setCookie(c, "auth__session", session);
    CreateSession(session, account.id);

    return c.json<SuccessResponse>(
      {
        success: true,
        message: "Successfully login!",
      },
      200
    );
  })

  // TODO: GET /logout company
  .get("/logout", async (c) => {})

  // TODO: GET /me company
  .get("/me", async (c) => {});

export default route;
