import * as BS from 'react-bootstrap';
import RawHtml from '../RawHtml/RawHtml';
import { CSSProperties, JSXElementConstructor, ReactElement } from 'react';
import './tooltip.scss';

interface TooltipProps {
    textStyle?: CSSProperties;
    text: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    children: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
}

const Tooltip: React.FC<TooltipProps> = ({ textStyle = {}, text = '', placement = 'bottom', children }) => {
    const tooltipContent = (
        <BS.Tooltip>
            <RawHtml style={{ ...textStyle, margin: '5px' }} html={text} />
        </BS.Tooltip>
    );

    return (
        <BS.OverlayTrigger trigger={['hover', 'focus']} placement={placement} overlay={tooltipContent}>
            {children}
        </BS.OverlayTrigger>
    );
};

export default Tooltip;
