import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ReactNode } from 'react';
import { ICategoryList } from '../ICategory/ICategory';

export interface IColumn {
    name: string;
    text: string;
    textCenter?: boolean;
    className?: string;
    bold?: boolean;
    boldRow?: boolean;
    clickableColumn?: boolean;
    list?: boolean;
    icon?: IconProp;
    formatter?: (name: string, row: ICategoryList) => string;
    component?: (props: ColumnComponentType) => ReactNode;
}

export type RowType = ICategoryList;

export type ColumnComponentType = {
    row: RowType;
    disabled?: boolean;
    onClick: (e: React.MouseEvent) => void;
    onUpdate: (id: string) => void;
};

export type RowsType = ICategoryList[];
