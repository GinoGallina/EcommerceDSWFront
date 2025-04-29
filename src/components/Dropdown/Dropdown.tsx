import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import Select, { MultiValue, SingleValue, StylesConfig } from 'react-select';
import classNames from 'classnames';
import InfoButton from '../InfoButton/InfoButton';

import './dropdown.scss';
import { DropdownOption, DropdownValue } from '../../interfaces';

interface DropdownProps {
    items: DropdownOption[];
    name?: string;
    className?: string;
    isMulti?: boolean;
    value?: DropdownValue;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    searchable?: boolean;
    clearable?: boolean;
    label?: string;
    helpText?: string;
    helpColor?: string;
    helpStyle?: React.CSSProperties;
    helpPlacement?: 'top' | 'right' | 'bottom' | 'left';
    onChange?: (value: DropdownValue) => void;
    onDirt?: () => void;
    disableOption?: (option: DropdownOption) => boolean;
}

const colorStyles: StylesConfig<DropdownOption, boolean> = {
    control: (styles) => ({
        ...styles,
        border: '1px solid steelblue !important;',
        boxShadow: 'none',
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => ({
        ...styles,
        backgroundColor: isDisabled ? '#ededed' : isSelected ? '#5684bc78' : isFocused ? 'rgba(0, 100, 160, 0.07)' : undefined,
        color: isSelected ? 'black' : '#646f75',
        cursor: isDisabled ? 'not-allowed' : 'default',
    }),
};

const Dropdown = forwardRef(
    (
        {
            items,
            label,
            className,
            isMulti = false,
            name,
            helpText,
            value = isMulti ? [] : null,
            required = false,
            disabled = false,
            placeholder = 'Seleccione una opción',
            searchable = true,
            clearable = false,
            helpColor = undefined,
            helpStyle = undefined,
            helpPlacement = 'right',
            onChange = () => {},
            onDirt = () => {},
            disableOption = () => false,
            ...props
        }: DropdownProps,
        ref
    ) => {
        const [selectedValue, setSelectedValue] = useState<MultiValue<DropdownOption> | SingleValue<DropdownOption>>(isMulti ? [] : null);

        useImperativeHandle(ref, () => ({
            clear: () => setSelectedValue(isMulti ? [] : null),
            items: () => items,
        }));

        const handleChange = useCallback(
            (selected: MultiValue<DropdownOption> | SingleValue<DropdownOption>) => {
                onDirt();
                if (isMulti) {
                    onChange((selected as DropdownOption[]).map((option) => option.value));
                } else {
                    onChange((selected as DropdownOption | null)?.value || null);
                }
            },
            [isMulti, onDirt, onChange]
        );

        useEffect(() => {
            const selected = isMulti ? items.filter((x) => (value as string[]).includes(x.value)) : items.find((x) => x.value === value) || null;
            setSelectedValue(selected);
        }, [isMulti, items, value]);

        return (
            <div className={`dropdown-container ${helpText ? 'padding-end' : ''}`}>
                <span className="dropdown">
                    <Select
                        {...props}
                        className={classNames(className, 'w-100')}
                        name={name}
                        styles={colorStyles}
                        required={required}
                        value={selectedValue}
                        placeholder={placeholder}
                        isDisabled={disabled}
                        isSearchable={searchable}
                        isClearable={clearable}
                        isMulti={isMulti}
                        options={items}
                        isOptionDisabled={disableOption}
                        onChange={handleChange}
                        noOptionsMessage={() => 'Sin resultados'}
                    />
                    {label && <small className={classNames('dropdown-text', required && 'required')}>{label}</small>}
                </span>
                {helpText && (
                    <div className="help-text">
                        <span className="d-flex justify-content-center align-items-center">
                            <InfoButton
                                textStyle={helpStyle}
                                style={{ marginLeft: '5px' }}
                                color={helpColor}
                                placement={helpPlacement}
                                helpText={helpText}
                            />
                        </span>
                    </div>
                )}
            </div>
        );
    }
);

const MemoDropdown = memo(Dropdown, (prevProps, nextProps) => {
    return nextProps.value === prevProps.value && nextProps.items === prevProps.items && nextProps.disabled === prevProps.disabled;
});

export default MemoDropdown;
