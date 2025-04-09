import authenticationRoutes from "./authentication";
import branchRoute from "./branch";
import companyRoute from "./company";
import serviceRoute from "./service";
import requirementRoute from "./requirement";
import clientRoute from "./client";
import transactionRoute from "./transaction";

export const routes = [
  authenticationRoutes,
  branchRoute,
  companyRoute,
  serviceRoute,
  requirementRoute,
  clientRoute,
  transactionRoute,
] as const;
