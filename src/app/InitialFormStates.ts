import { ICategoryForm, IProductForm } from '../interfaces';
import { IOrderDetailsForm } from '../interfaces/IOrder/IOrder';
import { IPaymentTypeForm } from '../interfaces/IPaymentType/IPaymentType';
import { IUserForm } from '../interfaces/IUser/IUser';

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
    static OrderDetails: IOrderDetailsForm = {
        paymentType: '',
        user: '',
        userId: '',
        shippingAddress: '',
        status: '',
        total: 0,
        items: [
            {
                id: '',
                product: '',
                productId: '',
                quantity: 0,
                status: '',
                price: 0,
                imagen: '',
            },
        ],
    };
    static User: IUserForm = {
        username: '',
        email: '',
        password: '',
        address: '',
        roles: [],
        storeName: '',
        storeDescription: '',
        cbu: '',
        cuit: '',
    };
    static PaymentType: IPaymentTypeForm = {
        name: '',
    };
}
