import { Hono } from "hono";
import { routes } from "./routes";

const app = new Hono();

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
