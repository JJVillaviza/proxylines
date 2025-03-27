import authenticationRoutes from "./authentication";
// import branchRoute from "./branch";
// import companyRoute from "./company";

export const routes = [
  authenticationRoutes,
  // branchRoute,
  // companyRoute,
] as const;

export type AppRoutes = (typeof routes)[number];
