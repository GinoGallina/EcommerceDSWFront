import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CSSProperties } from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import RawHtml from '../RawHtml/RawHtml';

import './infoButton.scss';

interface InfoButtonProps {
    style?: CSSProperties;
    textStyle?: CSSProperties;
    size?: SizeProp;
    color?: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    helpText: string;
}

const InfoButton: React.FC<InfoButtonProps> = ({
    style,
    size = 'sm',
    textStyle,
    color = 'steelblue',
    placement = 'bottom',
    helpText = '',
}) => {
    const tooltipContent = (
        <Tooltip>
            <RawHtml style={{ ...textStyle, margin: '5px' }} html={helpText} />
        </Tooltip>
    );

    return (
        <OverlayTrigger trigger={['hover', 'focus']} placement={placement} overlay={tooltipContent}>
            <FontAwesomeIcon size={size} icon={faInfoCircle} style={{ ...style, color }} />
        </OverlayTrigger>
    );
};

export default InfoButton;
