import type { ErrorResponse } from "@/types/response";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { env } from "./env";

export function errorHandling(err: Error, c: Context) {
  if (err instanceof HTTPException) {
    const errResponse =
      err.res ??
      c.json<ErrorResponse>(
        {
          success: false,
          error: err.message,
          isFormError:
            err.cause && typeof err.cause === "object" && "form" in err.cause
              ? err.cause.form === true
              : false,
        },
        err.status
      );
    return errResponse;
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      error:
        env.NODE_ENV === "production"
          ? "Interal Server Error"
          : err.stack ?? err.message,
    },
    500
  );
}
