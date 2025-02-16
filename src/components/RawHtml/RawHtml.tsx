import DOMPurify from 'dompurify';

interface RawHtmlProps {
    html: string;
    style?: React.CSSProperties;
}

const RawHtml: React.FC<RawHtmlProps> = ({ html, style }) => (
    <div style={style} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
);

export default RawHtml;
