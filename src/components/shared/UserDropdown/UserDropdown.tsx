import { memo, useEffect, useState } from 'react';
import { Dropdown } from '../..';
import { formatComboItems } from '../../../app/Helpers';
import API from '../../../app/API';
import { GetComboItemType, IComboDropdown, IGetComboRequest } from '../../../interfaces/shared/IGetCombo';
import { DropdownValue } from '../../../interfaces';
import { Roles } from '../../../app/constants/Roles';

interface IUserDropdown extends IComboDropdown {
    roles?: string[];
}
const UserDropdown: React.FC<IUserDropdown> = ({
    value = null,
    label = null,
    required = false,
    disabled = false,
    placeholder = 'Seleccione un usuario',
    roles = [Roles.Admin, Roles.User, Roles.Seller],
    isMulti = false,
    disableOption,
    onChange,
}) => {
    const [items, setItems] = useState<GetComboItemType[] | null>(null);

    // Get users
    useEffect(() => {
        if (items) return;

        API.post<IGetComboRequest, { roles: string[] }>('user/getCombo', { roles }).then((r) => {
            setItems(formatComboItems(r.data.items));
        });
    }, [items, roles]);

    const handleChange = (options: string) => {
        onChange(options);
    };

    return (
        <Dropdown
            placeholder={placeholder}
            label={label || ''}
            required={required}
            isMulti={isMulti}
            disabled={disabled}
            items={items ?? []}
            disableOption={disableOption}
            value={value}
            onChange={handleChange as (value: DropdownValue) => void}
        />
    );
};

const MemoDropdown = memo(UserDropdown, (prevProps, nextProps) => {
    return (
        nextProps.value === prevProps.value &&
        nextProps.label === prevProps.label &&
        nextProps.required === prevProps.required &&
        nextProps.placeholder === prevProps.placeholder &&
        nextProps.isMulti === prevProps.isMulti &&
        nextProps.disabled === prevProps.disabled
    );
});

export default MemoDropdown;
