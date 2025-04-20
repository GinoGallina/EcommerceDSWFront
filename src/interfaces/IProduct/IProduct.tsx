import { IGenericGetAllResquest, IGenericList, IGenericGetAllResponse } from '../shared/IGenericRequest';

export interface IProductForm {
    name: string;
    description: string;
    price: string;
    stock: string;
    image: string;
    categoryId: string;
    userId: string;
}

export interface IProductList extends IGenericList {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    categoryId: string;
}

export interface IProductListGetAllRequest extends IGenericGetAllResquest {
    text?: string;
    categoryIds?: string[];
    available?: boolean;
    price?: number;
    lessThan?: boolean;
}

export interface IProductResponse extends IGenericGetAllResponse {
    products: IProductList[];
}

// Create
export interface ICreateProductRequest {
    Id?: string;
    Name: string;
    Description: string;
    Stock: string;
    Price: string;
    Image: string;
    CategoryId: string;
    UserId: string;
}
export interface ICreateProductResponse {
    id: string;
    name: string;
    description: string;
    stock: number;
    price: number;
    image?: string;
    createdAt: string;
}
