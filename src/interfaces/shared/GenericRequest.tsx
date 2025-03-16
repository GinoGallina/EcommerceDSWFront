export interface SortRequestInterface {
    column: string | null;
    direction: string | null;
}
export interface DateRangeInterface {
    from: string;
    to: string;
}

export interface GenericGetAllResquestInterface {
    page?: number | null;
    columnSort?: string;
    sortDirection?: string;
    dateFrom?: string;
    dateTo?: string;
}
export interface GenericListInterface {
    id: string;
    endpoint: string;
    createdAt: string;
}

export interface GenericResponseInterface {
    totalCount: number;
}
