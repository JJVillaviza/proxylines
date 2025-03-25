import { Hono } from "hono";

const route = new Hono()

  // Base path
  .basePath("/api")

  // TODO: POST /register company
  .post("/register", async (c) => {})

  // TODO: POST /login company
  .post("/login", async (c) => {})

  // TODO: GET /logout company
  .get("/logout", async (c) => {})

  // TODO: GET /me company
  .get("/me", async (c) => {});

export default route;
