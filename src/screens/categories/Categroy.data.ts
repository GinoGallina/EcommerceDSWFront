import { ICategoryList } from '../../interfaces';
import { IColumn } from '../../interfaces/shared/ITable';

export const columns: IColumn<ICategoryList>[] = [
    {
        name: 'name',
        text: 'Nombre',
        textCenter: true,
    },
    {
        name: 'createdAt',
        text: 'Fecha de creación',
        textCenter: true,
    },
];

export const sortCategoryItems = [
    { value: 'name-asc', label: 'Nombre - Asc.' },
    { value: 'name-desc', label: 'Nombre - Desc.' },
    { value: 'createdAt-asc', label: 'Creado - Asc.' },
    { value: 'createdAt-desc', label: 'Creado - Desc.' },
];
