import { IGenericList, IGenericGetAllResponse } from '../shared/IGenericRequest';

// Get All
export interface IGetAllCategoryResponse extends IGenericGetAllResponse {
    categories: ICategoryList[];
}
export interface ICategoryList extends IGenericList {
    name: string;
}

// Create and Updatete Category
export interface ICategoryForm {
    name: string;
}

export interface ICreateCategoryRequest {
    Id?: string;
    Name: string;
}
export interface ICreateCategoryResponse {
    id: string;
    name: string;
    createdAt: string;
}
