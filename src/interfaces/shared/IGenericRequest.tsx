import { CSSProperties } from 'react';

export interface ISortRequest {
    column: string | null;
    direction: string | null;
}
export interface IDateRange {
    from: string;
    to: string;
}
export interface IGenericGetAllResquest {
    page?: number | null;
    limit: number;
    columnSort?: string;
    sortDirection?: string | null;
    dateFrom?: string;
    dateTo?: string;
}
export interface IGenericList {
    id: string;
    endpoint: string;
    createdAt: string;
    style?: CSSProperties;
    href?: string;
    isSelected?: boolean;
    disabled?: boolean;
    isActive?: boolean;
}

export interface IGenericResponse {
    totalCount: number;
}
