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

export const validateInt = (value: string) => {
    const parsedValue = parseInt(value);
    return value === null || (!isNaN(parsedValue) && parsedValue);
};

export const validateFloat = (value: string) => {
    const parsedValue = parseFloat(value);
    return value === null || (!isNaN(parsedValue) && parsedValue);
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00Z`;
};

export class Dates {
    static getToday(returnString = false) {
        const today = new Date();
        return returnString ? formatDate(today.toDateString()) : today;
    }

    static getTomorrow(date: string, returnString = false) {
        const today = date ? new Date(date) : new Date();
        const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        return returnString ? formatDate(tomorrow.toDateString()) : tomorrow;
    }

    static getLastWeek() {
        const today = new Date();
        const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        return formatDate(lastWeek.toDateString());
    }

    static getPreviousWeek(day: string) {
        const date = new Date(day);
        const lastWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
        return formatDate(lastWeek.toDateString());
    }

    static formatDate(date: string) {
        return formatDate(date);
    }

    static adjustDate = (date: string) => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate.toISOString();
    };
}
