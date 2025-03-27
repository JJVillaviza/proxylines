import { Hono } from "hono";
import { routes } from "./routes";
import { errorHandling } from "./utilities/error";
import type { Context } from "./utilities/context";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono<Context>();

app.use(logger());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.onError((err, c) => errorHandling(err, c));

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
