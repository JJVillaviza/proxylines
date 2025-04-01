import authenticationRoutes from "./authentication";
import branchRoute from "./branch";
import companyRoute from "./company";
import serviceRoute from "./service";

export const routes = [
  authenticationRoutes,
  branchRoute,
  companyRoute,
  serviceRoute,
] as const;

export type AppRoutes = (typeof routes)[number];
