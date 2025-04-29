import App from '../../app/App';
import { IColumn } from '../../interfaces';
import { IOrderList } from '../../interfaces/IOrder/IOrder';

export const confirmOrderCols = [
    {
        text: 'Producto',
        className: 'text-start',
        name: 'name',
    },
    {
        text: 'Precio',
        className: 'text-center',
        name: 'price',
    },
    {
        text: 'Cantidad',
        className: 'text-center',
        name: 'quantity',
    },
    {
        text: 'Total',
        className: 'text-center',
        name: '',
    },
];

export const getAllOrderCols = () => {
    const cols: IColumn<IOrderList>[] = [
        {
            text: 'Número',
            name: 'id',
            className: 'text-start',
        },
        {
            text: 'Método de pago',
            name: 'paymentType',
            className: 'text-start',
        },
        {
            text: 'Dirección',
            name: 'shippingAddress',
            className: 'text-center',
        },
        {
            text: 'Fecha de realización',
            name: 'createdAt',
            className: 'text-center',
        },
    ];

    if (App.isAdmin()) {
        cols.unshift({
            text: 'Usuario',
            name: 'user',
            className: 'text-start',
        });
    }

    return cols;
};
export const sortSortItems = [
    { value: 'total-asc', label: 'Total - Asc.' },
    { value: 'total-desc', label: 'Total - Desc.' },
    { value: 'createdAt-asc', label: 'Creado - Asc.' },
    { value: 'createdAt-desc', label: 'Creado - Desc.' },
];
