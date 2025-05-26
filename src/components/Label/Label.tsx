import { CSSProperties } from 'react';
import { FormLabel } from 'react-bootstrap';
import InfoButton from '../InfoButton/InfoButton';
import './label.scss';

interface LabelProps {
    children: string;
    htmlFor?: string;
    required?: boolean;
    style?: CSSProperties;
    helpText?: string;
    helpColor?: string;
    helpStyle?: CSSProperties;
    helpPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

const Label: React.FC<LabelProps> = ({
    children,
    required = false,
    htmlFor = '',
    style = {},
    helpText,
    helpColor = undefined,
    helpStyle = {},
    helpPlacement = undefined,
}) => (
    <FormLabel htmlFor={htmlFor || ''} style={{ ...style, marginBottom: '2px' }}>
        {children}
        {required && <span className="required"></span>}
        {helpText && (
            <InfoButton
                textStyle={helpStyle}
                size="sm"
                style={{ marginLeft: '5px' }}
                color={helpColor}
                placement={helpPlacement}
                helpText={helpText}
            />
        )}
    </FormLabel>
);

export default Label;
