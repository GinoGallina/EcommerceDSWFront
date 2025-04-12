import { ICategoryForm, IProductForm } from '../interfaces';
import { IPaymentTypeForm } from '../interfaces/IPaymentType/IPaymentType';

export class InitialFormStates {
    static Product: IProductForm = {
        name: '',
        description: '',
        image: '',
        price: '',
        stock: '',
        categoryId: '',
        userId: '',
    };
    static Category: ICategoryForm = {
        name: '',
    };
    static PaymentType: IPaymentTypeForm = {
        description: '',
    };
}
