import { memo, useEffect, useState } from 'react';
import { Dropdown } from '../..';
import { formatComboItems } from '../../../app/Helpers';
import API from '../../../app/API';
import { GetComboItemType, IComboDropdown, IGetComboRequest } from '../../../interfaces/shared/IGetCombo';
import { DropdownValue } from '../../../interfaces';

const CategoryDropdown: React.FC<IComboDropdown> = ({
    value = null,
    label = null,
    required = false,
    disabled = false,
    placeholder = 'Seleccione una categoría',
    isMulti = false,
    disableOption,
    onChange,
}) => {
    const [items, setItems] = useState<GetComboItemType[] | null>(null);

    // Get users
    useEffect(() => {
        if (items) return;

        API.get<IGetComboRequest>('category/getCombo', {}).then((r) => {
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
            items={items ?? []}
            disableOption={disableOption}
            value={value}
            onChange={handleChange as (value: DropdownValue) => void}
        />
    );
};

const MemoDropdown = memo(CategoryDropdown, (prevProps, nextProps) => {
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
