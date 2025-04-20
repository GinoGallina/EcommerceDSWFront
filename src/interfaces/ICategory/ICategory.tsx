import { IGenericList, IGenericGetAllResponse } from '../shared/IGenericRequest';

export interface ICategoryForm {
    name: string;
}

// Category List
export interface IGetAllCategoryResponse extends IGenericGetAllResponse {
    categories: ICategoryList[];
}
export interface ICategoryList extends IGenericList {
    name: string;
}

// Create Category
export interface ICreateCategoryRequest {
    Id?: string;
    Name: string;
}
export interface ICreateCategoryResponse {
    id: string;
    name: string;
    createdAt: string;
}
