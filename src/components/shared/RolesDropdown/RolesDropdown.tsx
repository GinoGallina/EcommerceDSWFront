import { memo, useEffect, useImperativeHandle, useState } from 'react';
import { Dropdown } from '../..';
import { formatComboItems, formatRole } from '../../../app/Helpers';
import API from '../../../app/API';
import { GetComboItemType, IComboDropdown, IGetComboRequest } from '../../../interfaces/shared/IGetCombo';
import { DropdownOption, DropdownValue } from '../../../interfaces';
import { Roles } from '../../../app/constants/Roles';

const RolesDropdown: React.FC<IComboDropdown> = ({
    value = null,
    label = null,
    required = false,
    disabled = false,
    placeholder = 'Seleccione un rol',
    isMulti = false,
    exclude = [],
    useDefaultDisableOption = true,
    disableOption,
    onChange,
    ref,
}) => {
    const [items, setItems] = useState<GetComboItemType[] | null>(null);

    useImperativeHandle(ref, () => ({
        items: () => items,
    }));

    // Get users
    useEffect(() => {
        if (items) return;

        API.get<IGetComboRequest>('role/getCombo', {}).then((r) => {
            setItems(
                formatComboItems(
                    r.data.items.map((x) => ({
                        ...x,
                        label: formatRole(x.label),
                    }))
                )
            );
        });
    }, [items]);

    const handleChange = (options: DropdownValue) => {
        onChange(options);
    };

    const handleDisableRoleOptions = (v: DropdownOption) => {
        if (disableOption) return disableOption(v);
        if (useDefaultDisableOption)
            return (
                (v.label !== formatRole(Roles.Admin) && value?.includes(items?.find((x) => x.label === formatRole(Roles.Admin))?.value || '')) ||
                (v.label === formatRole(Roles.Admin) &&
                    (value?.includes(items?.find((x) => x.label === formatRole(Roles.User))?.value || '') ||
                        value?.includes(items?.find((x) => x.label === formatRole(Roles.Seller))?.value || '')))
            );
    };

    return (
        <Dropdown
            placeholder={placeholder}
            label={label || ''}
            required={required}
            isMulti={isMulti}
            disabled={disabled}
            items={
                exclude.length === 0
                    ? (items ?? [])
                    : (items?.filter((x) => !exclude.map((x) => x.toLocaleLowerCase()).includes(x.label.toLocaleLowerCase())) ?? [])
            }
            value={value}
            disableOption={(v) => handleDisableRoleOptions(v) || false}
            ref={ref}
            onChange={handleChange}
        />
    );
};

const MemoDropdown = memo(RolesDropdown, (prevProps, nextProps) => {
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
