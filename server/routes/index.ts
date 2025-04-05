import authenticationRoutes from "./authentication";
import branchRoute from "./branch";
import companyRoute from "./company";
import serviceRoute from "./service";
import requirementRoute from "./requirement";

export const routes = [
  authenticationRoutes,
  branchRoute,
  companyRoute,
  serviceRoute,
  requirementRoute,
] as const;

export type AppRoutes = (typeof routes)[number];
