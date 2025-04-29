import { IColumn } from '../../interfaces';
import { IUserList } from '../../interfaces/IUser/IUser';

export const columns: IColumn<IUserList>[] = [
    {
        name: 'username',
        text: 'Nombre de usuario',
        textCenter: true,
    },
    {
        name: 'email',
        text: 'Email',
        textCenter: true,
    },
    {
        name: 'address',
        text: 'Dirección',
        textCenter: true,
    },
    {
        name: 'createdAt',
        text: 'Fecha de creación',
        textCenter: true,
    },
];

export const clientCols = [
    {
        name: 'name',
        text: 'Cliente',
        textCenter: true,
    },
    {
        name: 'address',
        text: 'Dirección',
        textCenter: true,
    },
    {
        name: 'route',
        text: 'Reparto',
        textCenter: true,
    },
];

export const sortUserItems = [
    { value: 'name-asc', label: 'Nombre - Asc.' },
    { value: 'name-desc', label: 'Nombre - Desc.' },
    { value: 'email-asc', label: 'Email - Asc.' },
    { value: 'email-desc', label: 'Email - Desc.' },
    { value: 'createdAt-asc', label: 'Creado - Asc.' },
    { value: 'createdAt-desc', label: 'Creado - Desc.' },
];
