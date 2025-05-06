import { IGenericGetAllResponse, IGenericGetAllResquest } from '../shared/IGenericRequest';

// Get All
export interface IReviewList {
    id: string;
    description: string;
    rate: number;
    user: string;
    createdAt: string;
}

export interface IReviewListGetAllRequest extends IGenericGetAllResquest {
    productId: string;
}

export interface IReviewGetAllResponse extends IGenericGetAllResponse {
    reviews: IReviewList[];
}

// Create
export interface ICreateReviewRequest {
    Description: string;
    Rate: number;
    ProductId: string;
}

export interface ICreateReviewResponse {
    id: string;
    description: string;
    rate: number;
    createdAt: string;
}
