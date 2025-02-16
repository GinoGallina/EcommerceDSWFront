import { CSSProperties } from 'react';
import { FormLabel } from 'react-bootstrap';
import InfoButton from '../InfoButton/InfoButton';

import './label.scss';

interface LabelProps {
    children: string;
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
    style = {},
    helpText = null,
    helpColor = undefined,
    helpStyle = {},
    helpPlacement = undefined,
}) => (
    <FormLabel style={{ ...style, marginBottom: '2px' }}>
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
