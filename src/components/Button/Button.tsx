import * as BS from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties, forwardRef, useImperativeHandle, useRef, MouseEvent, ReactNode } from 'react';
import classNames from 'classnames';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import './button.scss';

interface ButtonProps {
    style?: CSSProperties;
    className?: string;
    iconStyle?: CSSProperties;
    type?: 'button' | 'reset' | 'submit';
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    icon?: IconProp;
    left?: boolean;
    link?: boolean;
    disabled?: boolean;
    href?: string;
    size?: 'sm' | 'lg';
    children: ReactNode;
}

interface ButtonHandle {
    focus: () => void;
}

const Button = forwardRef<ButtonHandle, ButtonProps>(
    (
        {
            style,
            className = '',
            iconStyle,
            type = 'button',
            variant = 'primary',
            onClick = () => {},
            icon = null,
            children,
            link = false,
            disabled = false,
            href,
            size,
            left = false,
            ...props
        },
        ref
    ) => {
        const buttonRef = useRef<HTMLButtonElement | null>(null);

        useImperativeHandle(ref, () => ({
            focus: () => buttonRef.current && buttonRef.current.focus(),
        }));

        const Icon = () =>
            icon && (
                <FontAwesomeIcon
                    icon={icon}
                    style={{
                        ...iconStyle,
                        marginLeft: (iconStyle && iconStyle.marginLeft) || '5px',
                    }}
                />
            );

        return (
            <BS.Button
                {...props}
                size={size}
                className={classNames(className, link ? 'button-link' : '')}
                href={link ? href : undefined}
                ref={buttonRef}
                style={{
                    ...style,
                    minWidth: (style && style.minWidth) || '80px',
                }}
                variant={variant}
                disabled={disabled}
                type={type}
                onClick={onClick}
            >
                {icon && left && Icon()}
                {children}
                {icon && !left && Icon()}
            </BS.Button>
        );
    }
);

export default Button;
