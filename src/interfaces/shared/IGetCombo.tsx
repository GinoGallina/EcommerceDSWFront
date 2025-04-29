import { DropdownOption } from './IDropdown';

export type GetComboItemType = { value: string; label: string };

export interface IGetComboRequest {
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
    useDefaultDisableOption?: boolean;
    disableOption?: (option: DropdownOption) => boolean;
    onChange: (value: string) => void;
    ref?: React.RefObject<{ items: () => GetComboItemType[] | null } | null>;
}
