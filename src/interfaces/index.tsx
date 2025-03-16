import { TokenData } from './LoginInterface';
import { ProductFormInterface } from './Product/ProductInterfaces';
import {
    CategoryFormInterface,
    CategoryResponseInterface,
    CategoryListInterface,
} from './Category/CategoryInterfaces';
import {
    GenericGetAllResquestInterface,
    SortRequestInterface,
    DateRangeInterface,
    GenericResponseInterface,
    GenericListInterface,
} from './shared/GenericRequest';
import { DownloadInterface } from './shared/DownloadInterface';
import { DropdownOption, DropdownValue } from './shared/Dropdown';

export type ApiInterfaces =
    | TokenData
    | DownloadInterface
    | ProductFormInterface
    | CategoryResponseInterface;

export type {
    ProductFormInterface,
    CategoryFormInterface,
    SortRequestInterface,
    DateRangeInterface,
    GenericGetAllResquestInterface,
    CategoryListInterface,
    GenericResponseInterface,
    GenericListInterface,
    DropdownOption,
    DropdownValue,
};
