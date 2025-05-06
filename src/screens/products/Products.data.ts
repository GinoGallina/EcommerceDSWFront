import { IColumn } from '../../interfaces';
import { IProductList } from '../../interfaces/IProduct/IProduct';

// My Products
export const myProductCols: IColumn<IProductList>[] = [
    {
        name: 'name',
        text: 'Nombre',
        textCenter: true,
    },
    {
        name: 'price',
        text: 'Precio',
        textCenter: true,
    },
    {
        name: 'stock',
        text: 'Stock',
        textCenter: true,
    },
    {
        name: 'categoryName',
        text: 'Categoría',
        textCenter: true,
    },
    {
        name: 'createdAt',
        text: 'Fecha de creación',
        textCenter: true,
    },
];

export const sortMyProductItems = [
    { value: 'name-asc', label: 'Nombre - Asc.' },
    { value: 'name-desc', label: 'Nombre - Desc.' },
    { value: 'price-asc', label: 'Precio - Asc.' },
    { value: 'price-desc', label: 'Precio - Desc.' },
    { value: 'createdAt-asc', label: 'Creado - Asc.' },
    { value: 'createdAt-desc', label: 'Creado - Desc.' },
];

// All products
export const sortProductListItems = [
    { value: 'name-asc', label: 'Nombre - Asc.' },
    { value: 'name-desc', label: 'Nombre - Desc.' },
    { value: 'price-asc', label: 'Precio - Asc.' },
    { value: 'price-desc', label: 'Precio - Desc.' },
];
