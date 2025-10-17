import { type RouteProps } from "react-router-dom";
export interface ITenant {
    name: string;
    businessname: string;
    websiteurl: string;
    isactive: boolean;
    isResourceCreated: boolean;
    owners: any;
    instances: IInstance[];
    xdmdatabase: string;
    powerappsenvironmentid: string;
    isSkyPointDefaultSettings: boolean;
    stripeCustomerId: string;
    isSkyPointDefaultDB: boolean;
    apiEnable: boolean;
    id: string;
    datecreated: Date;
    dateupdated: Date;
    createdby: string;
    updatedby: string;
}

export interface IInstance {
    name: string;
    displayname: string;
    description: null | string;
    type: Type;
    isactive: boolean;
    timezone: string;
    dataRefreshschedule: IDataRefreshschedule | null;
    instancePrivacy: IInstancePrivacy[] | null;
    instanceHistory: IInstanceHistory[] | null;
    id: string;
    datecreated: Date;
    dateupdated: Date;
    createdby: string;
    updatedby: string;
}

export interface IDataRefreshschedule {
    isactive: boolean;
    frequency: string;
    timezone: string;
    cronschedules: string[];
    weekDays: number[] | null;
    stitchFlow: string;
}

export interface IInstanceHistory {
    action: string;
    initiatedBy: string;
    initiatedById: string;
    status: string;
    startTime: Date;
    endTime: Date;
}

export interface IInstancePrivacy {
    privacyId: string;
    privacyDomain: string;
}

export interface IResponse<T> {
    isSuccessful: boolean;
    message: string;
    data: T
}
export interface ITenantsProps {
    tenants: ITenant[];
    isPlatformAdmin:boolean;
    accessableTenant:Array<any>;
    props?:RouteProps
}
export interface IEditCreateTenantProps {
    title: string;
    isEdit: boolean;
    isOpen: boolean;
    isSubmitting: boolean;
    errorMessage: string;
    formData: ITenantFormModel;
    saveUpdateTenant: (data: ITenantFormModel) => void;
    setFormData: React.Dispatch<React.SetStateAction<ITenantFormModel>>;
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    onDismiss: () => void;
}

export enum Type {
    Production = "Production",
    Sandbox = "Sandbox",
    Trial = "Trial",
}

export interface ITenantFormModel {
    name: string,
    businessName: string,
    websiteUrl: string,
    id: string
}