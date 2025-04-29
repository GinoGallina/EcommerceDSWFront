import { IColumn } from '../../interfaces';
import { IPaymentTypeList } from '../../interfaces/IPaymentType/IPaymentType';

export const columns: IColumn<IPaymentTypeList>[] = [
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
    { value: 'name-asc', label: 'Descripción - Asc.' },
    { value: 'name-desc', label: 'Descripción - Desc.' },
    { value: 'createdAt-asc', label: 'Creado - Asc.' },
    { value: 'createdAt-desc', label: 'Creado - Desc.' },
];
