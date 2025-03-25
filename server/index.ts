import { Hono } from "hono";
import { routes } from "./routes";
import { errorHandling } from "./utilities/error";

const app = new Hono();

routes.forEach((route) => {
  app.route("/", route);
});

app.onError((err, c) => errorHandling(err, c));

export default app;
