import { loginValidation, registerValidation } from "@/types/validation";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const route = new Hono()

  // Base path
  .basePath("/api")

  // TODO: POST /register company
  .post("/register", zValidator("form", registerValidation), async (c) => {})

  // TODO: POST /login company
  .post("/login", zValidator("form", loginValidation), async (c) => {})

  // TODO: GET /logout company
  .get("/logout", async (c) => {})

  // TODO: GET /me company
  .get("/me", async (c) => {});

export default route;
