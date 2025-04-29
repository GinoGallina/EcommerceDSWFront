import { IGenericList, IGenericGetAllResponse } from '../shared/IGenericRequest';

export interface IPaymentTypeForm {
    name: string;
}

export interface IPaymentTypeList extends IGenericList {
    name: string;
}

export interface IPaymentTypeResponse extends IGenericGetAllResponse {
    paymentTypes: IPaymentTypeList[];
}
