import { IGenericGetAllResquest, IGenericList, IGenericGetAllResponse } from '../shared/IGenericRequest';

// Details
export interface IProductDetailsForm {
    name: string;
    description: string;
    price: string;
    stock: string;
    image: string;
    categoryName: string;
    sellerDetails: {
        userName: string;
        storeName: string;
        storeDescription: string;
    };
}

// Get All
export interface IProductList extends IGenericList {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    rating: {
        rate: number;
        totalReviews: number;
    };
    categoryName?: string;
}
export interface IProductListGetAllRequest extends IGenericGetAllResquest {
    text: string;
    categoryIds: string[];
    available: boolean;
    price?: string;
    priceOption?: string;
}

export interface IProductListGetAllResponse extends IGenericGetAllResponse {
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

export interface IProductForm {
    name: string;
    description: string;
    price: string;
    stock: string;
    image: string;
    categoryId: string;
    userId: string;
}
