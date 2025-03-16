import { CategoryFormInterface, ProductFormInterface } from '../interfaces';

export class InitialFormStates {
    static Product: ProductFormInterface = {
        name: '',
        description: '',
        image: '',
        price: '',
        stock: '',
        categoryId: '',
    };
    static Category: CategoryFormInterface = {
        name: '',
    };
}
