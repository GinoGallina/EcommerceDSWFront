import { CSSProperties, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import classNames from 'classnames';

import './checkBox.scss';
import InfoButton from '../InfoButton/InfoButton';
import { Placement } from 'react-bootstrap/esm/types';
interface ICheckBoxProps {
    checked?: boolean;
    isSwitch?: boolean;
    name?: string;
    label: string;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
    helpText?: string;
    helpPlacement?: Placement;
    onChange: (value: boolean) => void;
}

const CheckBox: React.FC<ICheckBoxProps> = forwardRef(
    (
        {
            checked = false,
            isSwitch = false,
            name = '',
            label = '',
            disabled = false,
            className = '',
            style = {},
            helpText = null,
            helpPlacement = undefined,
            onChange = () => {},
        },
        ref
    ) => {
        const checkboxRef = useRef<HTMLInputElement | null>(null);
        const [value, setValue] = useState(checked);

        useImperativeHandle(ref, () => ({
            focus: () => checkboxRef.current && checkboxRef.current?.focus(),
        }));

        const _update = (value: boolean) => {
            setValue(value);
            onChange(value);
        };

        useEffect(() => {
            setValue(checked);
        }, [checked]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            _update(e.target.checked);
        };

        return (
            <div className={classNames('form-check', isSwitch && 'form-switch', disabled && 'disabled', className)} style={style}>
                <label className="form-check-label">
                    <input
                        className="form-check-input custom-checkbox"
                        name={name}
                        type="checkbox"
                        checked={value}
                        disabled={disabled}
                        onChange={handleChange}
                        ref={checkboxRef}
                    />
                    {label}
                    {helpText && <InfoButton style={{ marginLeft: '5px' }} helpText={helpText} helpPlacement={helpPlacement} />}
                </label>
            </div>
        );
    }
);

export default CheckBox;
