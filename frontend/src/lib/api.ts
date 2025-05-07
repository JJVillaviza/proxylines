import { hc } from "hono/client";
import type { AppRoutes } from "../../../types/api";
import { ErrorResponse, SuccessResponse } from "@/types/response";
import { queryOptions } from "@tanstack/react-query";

const client = hc<AppRoutes>("/", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
}).api;

export const postRegister = async (
  name: string,
  email: string,
  username: string,
  password: string
) => {
  try {
    const res = await client.account.register.$post({
      form: {
        name,
        email,
        username,
        password,
      },
    });
    if (res.ok) {
      return (await res.json()) as SuccessResponse;
    }
    return (await res.json()) as unknown as ErrorResponse;
  } catch (error) {
    return {
      success: false,
      error: String(error),
      isFormError: false,
    } as ErrorResponse;
  }
};

export const postLogin = async (username: string, password: string) => {
  try {
    const res = await client.account.login.$post({
      form: {
        username,
        password,
      },
    });
    if (res.ok) {
      return (await res.json()) as SuccessResponse;
    }
    return (await res.json()) as unknown as ErrorResponse;
  } catch (error) {
    return {
      success: false,
      error: String(error),
      isFormError: false,
    } as ErrorResponse;
  }
};

export const getUser = async () => {
  const res = await client.account.me.$get();
  if (res.ok) {
    const data = await res.json();
    return data.data.name;
  }
  return null;
};

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity,
  });
