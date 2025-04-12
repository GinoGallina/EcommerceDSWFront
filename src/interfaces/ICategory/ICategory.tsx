import { IGenericList, IGenericResponse } from '../shared/IGenericRequest';

export interface ICategoryForm {
    name: string;
}

export interface ICategoryList extends IGenericList {
    name: string;
}

export interface ICategoryResponse extends IGenericResponse {
    categories: ICategoryList[];
}
