import { OrderItemStatuses } from '../../app/constants/Statuses';

export const getStatus = (value: string) => {
    switch (value) {
        case OrderItemStatuses.Pending:
            return { value: 'Pendiente', color: 'rgba(255, 193, 7)' };
        case OrderItemStatuses.Paid:
            return { value: 'Pagado', color: 'rgba(40, 167, 69)' };
        case OrderItemStatuses.Shipped:
            return { value: 'Enviado', color: 'rgba(23, 162, 184)' };
        case OrderItemStatuses.Delivered:
            return { value: 'Entregado', color: 'rgba(0, 123, 255)' };
        case OrderItemStatuses.Canceled:
            return { value: 'Cancelada', color: 'rgba(220, 53, 69)' };
        default:
            return { value: '', color: '' };
    }
};
