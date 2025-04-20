import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ReactNode } from 'react';

export interface IColumn<T> {
    name: keyof T | '';
    text: string;
    textCenter?: boolean;
    className?: string;
    bold?: boolean;
    boldRow?: boolean;
    clickableColumn?: boolean;
    list?: boolean;
    icon?: IconProp;
    formatter?: (value: string, row: T) => string;
    component?: (props: ColumnComponentType<T>) => ReactNode;
}

export type ColumnComponentType<T> = {
    row: T;
    disabled?: boolean;
    onClick: (e: React.MouseEvent) => void;
    onUpdate: (id: string) => void;
};

export type BaseRowProps = {
    href?: string;
    style?: React.CSSProperties;
    isSelected?: boolean;
    disabled?: boolean;
};

export type RowType<T> = T & BaseRowProps;

export type RowsType<T> = RowType<T>[];

export interface IGenericTableColumn {
    actions: string;
}
