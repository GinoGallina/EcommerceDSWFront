import { IGenericGetAllResponse, IGenericList } from '../shared/IGenericRequest';

export interface IOrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

// Confirm Order
export interface IConfirmOrderRequest {
    PaymentTypeId: string;
    Items: { ProductId: string; Quantity: number }[];
}

// Order List
export interface IGetAllOrdersResponse extends IGenericGetAllResponse {
    orders: IOrderList[];
}

export interface IOrderList extends IGenericList {
    totalAmount: number;
    status: string;
    paymentType: string;
    shippingAddress: string;
    user?: string;
}
