import { memo, useEffect, useState } from 'react';
import { Dropdown } from '../..';
import { formatComboItems } from '../../../app/Helpers';
import API from '../../../app/API';
import { GetComboItemType, IComboDropdown, IGetComboRq } from '../../../interfaces/shared/IGetCombo';
import { DropdownValue } from '../../../interfaces';

const RolesDropdown: React.FC<IComboDropdown> = ({
    value = null,
    label = null,
    required = false,
    disabled = false,
    placeholder = 'Seleccione un rol',
    isMulti = false,
    exclude = [],
    disableOption,
    onChange,
}) => {
    const [items, setItems] = useState<GetComboItemType[] | null>(null);

    // Get users
    useEffect(() => {
        if (items) return;

        API.get<IGetComboRq>('role/getCombo', {}).then((r) => {
            setItems(formatComboItems(r.data.items));
        });
    }, [items]);

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
            items={
                exclude.length === 0
                    ? (items ?? [])
                    : (items?.filter((x) => !exclude.map((x) => x.toLocaleLowerCase()).includes(x.label.toLocaleLowerCase())) ?? [])
            }
            value={value}
            disableOption={disableOption}
            onChange={handleChange as (value: DropdownValue) => void}
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
