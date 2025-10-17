// Barrel export for clients
export { auth } from "./authClient";
export { errorHandler } from "./errorhandler";
export { validateInstance, checkResourceExistence } from "./apiClient";
export type {
  IValidateInstancePayload,
  IValidateInstanceResponse,
  IBasicApiResponse,
} from "./apiClients.interface";
