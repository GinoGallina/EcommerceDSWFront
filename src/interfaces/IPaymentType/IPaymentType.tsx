import { IGenericList, IGenericGetAllResponse } from '../shared/IGenericRequest';

// Create and Update
export interface IPaymentTypeForm {
    name: string;
}
export interface IPaymentTypeCreateRequest {
    Name: string;
}
export interface IPaymentTypeCreateResponse {
    id: string;
    name: string;
    createdAt: string;
}

// Get All
export interface IPaymentTypeList extends IGenericList {
    name: string;
}

export interface IPaymentTypeResponse extends IGenericGetAllResponse {
    paymentTypes: IPaymentTypeList[];
}
