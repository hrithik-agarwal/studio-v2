import type { IInstance } from "./tenents.interface";

export interface IValidateInstancePayload {
  objectId: string | null | undefined;
  instanceId: string;
}

export interface IValidateInstanceResponse {
  hasAccess: boolean;
  isValidInstace: boolean; // Note: keeping original typo for API compatibility
}

export interface IBasicApiResponse {
  isSuccessful: boolean;
  message: string;
}
export interface IDefaultInstancePayload {
  objectId: string;
}
export interface IDefaultInstanceResponse extends IBasicApiResponse {
  instance: IInstance;
}