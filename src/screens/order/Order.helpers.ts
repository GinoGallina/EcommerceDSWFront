import { OrderStatuses } from '../../app/constants/Statuses';

export const getStatus = (value: string) => {
    switch (value) {
        case OrderStatuses.Pending:
            return { value: 'Pendiente', color: 'rgba(255, 193, 7)' };
        case OrderStatuses.Paid:
            return { value: 'Pagado', color: 'rgba(40, 167, 69)' };
        case OrderStatuses.Shipped:
            return { value: 'Enviado', color: 'rgba(23, 162, 184)' };
        case OrderStatuses.Delivered:
            return { value: 'Entregado', color: 'rgba(0, 123, 255)' };
        case OrderStatuses.Cancelled:
            return { value: 'Cancelado', color: 'rgba(220, 53, 69)' };
        default:
            return { value: '', color: '' };
    }
};
