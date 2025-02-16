import classNames from 'classnames';
import {
    CSSProperties,
    forwardRef,
    useImperativeHandle,
    useRef,
    MouseEvent,
    FocusEvent,
    useState,
} from 'react';
import InfoButton from '../InfoButton/InfoButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSearch } from '@fortawesome/free-solid-svg-icons';

import './input.scss';

interface InputProps {
    value?: string;
    defaultValue?: string;
    tag?: 'input' | 'textarea';
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    helpText?: string;
    extraHelpText?: string;
    extraHelpColor?: string;
    extraHelpStyle?: CSSProperties;
    extraHelpPlacement?: 'top' | 'bottom' | 'left' | 'right';
    borderless?: boolean;
    showIcon?: boolean;
    isFloat?: boolean;
    isPhone?: boolean;
    required?: boolean;
    style?: CSSProperties;
    onChange?: (value: string) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onClick?: (event: MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit?: () => void;
    maxLength?: number;
    maxLengthFloat?: number;
    minValue?: number;
    maxValue?: number;
    autoTrim?: boolean;
    autoComplete?:
        | 'on'
        | 'off'
        | 'name'
        | 'email'
        | 'username'
        | 'new-password'
        | 'current-password';
    inputMode?: 'none' | 'text' | 'tel' | 'email' | 'url' | 'numeric' | 'decimal' | 'search';
    disabled?: boolean;
    className?: string;
    submitOnEnter?: boolean;
    cols?: number;
    rows?: number;
}

interface InputHandle {
    clear: () => void;
    focus: () => void;
}

const Input = forwardRef<InputHandle, InputProps>(
    (
        {
            value = '',
            tag = 'input',
            type = 'text',
            placeholder = '',
            helpText = null,
            extraHelpText = null,
            extraHelpColor = undefined,
            extraHelpStyle = {},
            extraHelpPlacement = undefined,
            borderless = false,
            showIcon = false,
            isFloat = false,
            isPhone = false,
            required = false,
            style = {},
            onChange = () => {},
            onFocus = () => {},
            onClick = () => {},
            onSubmit = () => {},
            maxLength = 30,
            maxLengthFloat = 2,
            minValue = undefined,
            maxValue = undefined,
            autoTrim = false,
            disabled = false,
            className = undefined,
            submitOnEnter = false,
            cols = 30,
            rows = 4,
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(type === 'text');
        const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

        const handleTogglePassword = () => {
            setShowPassword((prev) => !prev);
        };

        useImperativeHandle(ref, () => ({
            clear: () => _update(''),
            focus: () => inputRef.current && inputRef.current.focus(),
        }));

        const _update = (value: string) => {
            if (inputRef.current) {
                inputRef.current.value = value;
            }
            onChange(value);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const isNumeric = type === 'number';

            let value = e.target.value;
            if (autoTrim) {
                value = value.trim();
            }
            if (maxLength && value.length > maxLength) {
                value = value.substring(0, maxLength);
            }
            if (isNumeric && Number.isNaN(Number(value))) {
                return;
            }
            if (isNumeric && value !== '' && !Number.isNaN(Number(value))) {
                if (isFloat) {
                    const parts = value.split('.');
                    if (parts.length > 1) {
                        const decimalPart = parts[1];
                        if (decimalPart.length > maxLengthFloat) {
                            value = parseFloat(value).toFixed(maxLengthFloat);
                        } else if (decimalPart != '') {
                            value =
                                decimalPart != '0' ? parseFloat(value).toString() : `${parts[0]}.0`;
                        }
                    } else {
                        value = parseFloat(value).toString();
                    }
                } else {
                    value = parseInt(value).toString();
                }
            }
            if (minValue !== undefined && Number(value) < minValue) {
                value = String(minValue);
            }
            if (maxValue !== undefined && Number(value) > maxValue) {
                value = String(maxValue);
            }
            if (isPhone && value.length > 10) {
                value = value.substring(0, 10);
            }

            if (
                isNumeric &&
                !isFloat &&
                Number.isInteger(parseFloat(value)) &&
                value !== '' &&
                !Number.isNaN(Number(value))
            ) {
                value = parseInt(value).toString();
            }
            _update(value);
        };

        const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (autoTrim) {
                _update(e.target.value.trim());
            }
            onFocus(e);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (submitOnEnter && e.key === 'Enter') onSubmit();
        };

        const inputProps = {
            value,
            style,
            type:
                type === 'text' || type === 'password'
                    ? showPassword
                        ? 'text'
                        : 'password'
                    : type,
            required,
            placeholder,
            step: isFloat ? 0.01 : 1,
            disabled: disabled || undefined,
            className: classNames(
                'form-control',
                borderless && 'input-borderless',
                showIcon && 'with-icon',
                className
            ),
            onChange: handleChange,
            onFocus: handleFocus,
            onClick: onClick,
            min: minValue || undefined,
            max: maxValue || undefined,
        };

        if (tag === 'input') {
            return (
                <span className="input-container">
                    <span className="input-wrapper">
                        <input
                            {...inputProps}
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            onKeyDown={handleKeyDown}
                        />
                        {showIcon && (
                            <FontAwesomeIcon style={{ left: '5px' }} icon={faSearch} color="#ccc" />
                        )}
                        {type === 'password' && (
                            <FontAwesomeIcon
                                style={{ right: '10px', cursor: 'pointer' }}
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={handleTogglePassword}
                            />
                        )}
                    </span>
                    {helpText && (
                        <small className={classNames('input-text', required && 'required')}>
                            {helpText}
                        </small>
                    )}
                    {extraHelpText && (
                        <InfoButton
                            textStyle={extraHelpStyle}
                            style={{ marginLeft: '5px' }}
                            color={extraHelpColor}
                            placement={extraHelpPlacement}
                            helpText={extraHelpText}
                        />
                    )}
                </span>
            );
        } else if (tag === 'textarea') {
            return (
                <span className="input-container">
                    <textarea
                        {...inputProps}
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        cols={cols}
                        rows={rows}
                    />
                    {helpText && (
                        <small className={classNames('input-text', required && 'required')}>
                            {helpText}
                        </small>
                    )}
                    {extraHelpText && (
                        <InfoButton
                            textStyle={extraHelpStyle}
                            style={{ marginLeft: '5px' }}
                            color={extraHelpColor}
                            placement={extraHelpPlacement}
                            helpText={extraHelpText}
                        />
                    )}
                </span>
            );
        }
        return null;
    }
);

export default Input;
