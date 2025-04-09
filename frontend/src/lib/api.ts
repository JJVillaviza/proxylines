import { hc } from "hono/client";
import { AppRoutes } from "@/types/api";
import { ErrorResponse, SuccessResponse } from "@/types/response";

const client = hc<AppRoutes>("/").api;

export const postRegister = async (
  name: string,
  email: string,
  username: string,
  password: string
) => {
  try {
    const result = await client.account.register.$post({
      form: {
        name,
        email,
        username,
        password,
      },
    });
    if (result.ok) {
      const data = (await result.json()) as SuccessResponse;
      return data;
    }
    const data = (await result.json()) as unknown as ErrorResponse;
    return data;
  } catch (error) {
    return {
      success: false,
      error: String(error),
      isFormError: false,
    } as ErrorResponse;
  }
};
