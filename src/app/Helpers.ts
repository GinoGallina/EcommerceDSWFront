import { IDateRange, IGenericGetAllResquest, ISortRequest } from '../interfaces';
import { GetComboItemTypeRq } from '../interfaces/shared/IGetCombo';
import { Roles } from './constants/Roles';

export const formatComboItems = (items: GetComboItemTypeRq[]) => {
    return items.map((item) => ({
        value: item.id,
        label: item.label,
    }));
};

export const formatCurrency = (value: string | number) => {
    if (Number(value) < 0)
        return `-$${Math.abs(Number(value)).toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    return `$${value.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export const formatRole = (role: string) => {
    switch (role) {
        case Roles.Admin:
            return 'Administrador';
        case Roles.Seller:
            return 'Vendedor';
        case Roles.User:
            return 'Usuario';
        default:
            return 'Sin rol';
    }
};

export const buildGenericGetAllRq = (currentPage: number | null, sort?: ISortRequest | null, dateRange?: IDateRange, limit?: number) => {
    const rq: IGenericGetAllResquest = {
        page: currentPage,
        limit: 10,
    };

    if (rq.limit) rq.limit = limit as number;

    if (sort && sort.column) {
        rq.columnSort = sort.column;
        rq.sortDirection = sort.direction;
    }
    if (dateRange && dateRange.from && dateRange.to) {
        rq.dateFrom = Dates.formatDate(dateRange.from);
        rq.dateTo = Dates.formatDate(dateRange.to);
    }

    return rq;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00Z`;
};

export class Dates {
    static formatDate(date: string) {
        return formatDate(date);
    }
}
