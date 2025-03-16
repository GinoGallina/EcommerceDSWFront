import { GenericListInterface, GenericResponseInterface } from '../shared/GenericRequest';

export interface CategoryFormInterface {
    name: string;
}

export interface CategoryListInterface extends GenericListInterface {
    name: string;
}

export interface CategoryResponseInterface extends GenericResponseInterface {
    categories: CategoryListInterface[];
}
