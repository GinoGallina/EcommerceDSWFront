import { IGenericList, IGenericGetAllResponse } from '../shared/IGenericRequest';

export interface IPaymentTypeForm {
    description: string;
}

export interface IPaymentTypeList extends IGenericList {
    description: string;
}

export interface IPaymentTypeResponse extends IGenericGetAllResponse {
    paymentTypes: IPaymentTypeList[];
}
