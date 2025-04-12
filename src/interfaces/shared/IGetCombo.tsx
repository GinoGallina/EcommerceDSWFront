import { DropdownOption } from './IDropdown';

export type GetComboItemType = { value: string; label: string };

export interface IGetComboRq {
    items: GetComboItemTypeRq[];
}

export type GetComboItemTypeRq = { id: string; label: string };

export interface IComboDropdown {
    value: string | string[];
    label?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    isMulti: boolean;
    exclude?: string[];
    disableOption?: (option: DropdownOption) => boolean;
    onChange: (value: string) => void;
}
