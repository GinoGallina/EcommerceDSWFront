import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CategoryListInterface } from '../ICategory/ICategory';
import { ReactNode } from 'react';

export interface ColumnInterface {
    name: string;
    text: string;
    textCenter?: boolean;
    className?: string;
    bold?: boolean;
    boldRow?: boolean;
    clickableColumn?: boolean;
    list?: boolean;
    icon?: IconProp;
    formatter?: (name: string, row: CategoryListInterface) => string;
    component?: (props: ColumnComponentType) => ReactNode;
}

export type RowType = CategoryListInterface;

export type ColumnComponentType = {
    row: RowType;
    disabled?: boolean;
    onClick: (e: React.MouseEvent) => void;
    onUpdate: (id: string) => void;
};

export type RowsType = CategoryListInterface[];
