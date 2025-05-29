import App from '../../app/App';
import { IColumn } from '../../interfaces';
import { IMyProductList } from '../../interfaces/IProduct/IProduct';

// My Products
export const myProductCols: IColumn<IMyProductList>[] = (() => {
    const cols: IColumn<IMyProductList>[] = [
        {
            name: 'name',
            text: 'Nombre',
            textCenter: true,
        },
        {
            name: 'categoryName',
            text: 'Categoría',
            textCenter: true,
        },
    ];

    if (App.isAdmin()) {
        cols.push({
            name: 'user',
            text: 'Usuario',
            textCenter: true,
        });
    }

    cols.push(
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
            name: 'createdAt',
            text: 'Fecha de creación',
            textCenter: true,
        }
    );

    return cols;
})();

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
