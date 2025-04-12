import { IGenericGetAllResquest, IGenericList, IGenericResponse } from '../shared/IGenericRequest';

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

export interface IProductResponse extends IGenericResponse {
    products: IProductList[];
}
