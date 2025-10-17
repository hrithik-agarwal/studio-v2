import type {
  IBasicApiResponse,
  IDefaultInstancePayload,
  IDefaultInstanceResponse,
  IValidateInstancePayload,
  IValidateInstanceResponse,
} from "./apiClients.interface";
import { auth } from "./authClient";
import { errorHandler } from "./errorhandler";

export const validateInstance = async (
  payload: IValidateInstancePayload
): Promise<IValidateInstanceResponse> => {
  return fetch(
    import.meta.env.VITE_API_BASE_URL + "/api/user/validateinstance-studio",
    {
      method: "POST",
      headers: auth.getAuthorizationHeader(),
      body: JSON.stringify(payload),
    }
  )
    .then(errorHandler)
    .then((response) => response.json());
};
export const checkResourceExistence = async (): Promise<IBasicApiResponse> => {
  return fetch(
    import.meta.env.VITE_API_BASE_URL + "/api/tenant/checkifresourceexist",
    {
      headers: auth.getAuthorizationHeader(),
    }
  )
    .then(errorHandler)
    .then((response) => response.json());
};
export const getDefaultInstanceOfUser = async (
  payload: IDefaultInstancePayload
): Promise<IDefaultInstanceResponse> => {
  return fetch(
    import.meta.env.VITE_API_BASE_URL + "/api/user/getdefaultinstance",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )
    .then(errorHandler)
    .then((response) => response.json());
};
