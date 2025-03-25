import account from "./account";
import branch from "./branch";
import company from "./company";

export const routes = [account, branch, company] as const;

export type AppRoutes = (typeof routes)[number];
