import { TokenData } from './LoginInterface';
import { IProductForm } from './IProduct/IProduct';
import { ICategoryForm, ICategoryResponse, ICategoryList } from './ICategory/ICategory';
import { IGenericGetAllResquest, ISortRequest, IDateRange, IGenericResponse, IGenericList } from './shared/IGenericRequest';
import { DownloadInterface } from './shared/Download';
import { DropdownOption, DropdownValue } from './shared/IDropdown';
import { ColumnInterface, RowType, RowsType } from './shared/Table';

export type ApiInterfaces = TokenData | DownloadInterface | IProductForm | ICategoryResponse;

export type {
    IProductForm,
    ICategoryForm,
    ISortRequest,
    IDateRange,
    IGenericGetAllResquest,
    ICategoryList,
    IGenericResponse,
    IGenericList,
    DropdownOption,
    DropdownValue,
    ColumnInterface,
    RowType,
    RowsType,
};
