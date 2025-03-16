import classNames from 'classnames';
import * as BS from 'react-bootstrap';
import { formatCurrency } from '../../app/Helpers';
import Button from '../Button/Button';
import { CSSProperties } from 'react';

import './productCard.scss';

interface ProductCardProps {
    className?: string;
    cardBodyClassName?: string;
    id?: number;
    name: string;
    description: string;
    price: number;
    stock?: number;
    image: string;
    style?: CSSProperties;
    onViewDetails?: () => void;
    onAddToCart?: () => void;
}
const ProductCard: React.FC<ProductCardProps> = ({
    className,
    cardBodyClassName,
    name,
    image,
    description,
    price,
    style,
    onViewDetails = () => {},
    onAddToCart = () => {},
}) => {
    return (
        <BS.Card style={{ ...style }} className={classNames('p-2 product-card', className)}>
            <BS.CardBody className={classNames(cardBodyClassName, 'p-0 d-flex flex-column')}>
                <div className="img-container mb-3">
                    <BS.Image src={image} className="w-100 h-100" />
                </div>
                <div className="product-card-details mb-1">
                    <h5 className="text-center w-100">{name}</h5>
                    <h6 className="text-center w-100 product-card-description">{description}</h6>
                    <span className="text-center bold price w-100">{formatCurrency(price)}</span>
                </div>
            </BS.CardBody>
            <div className="product-card-footer p-2 d-flex flex-column">
                <Button onClick={onViewDetails}>Ver detalles</Button>
                <Button className="bg-success border-0" onClick={onAddToCart}>
                    Agregar a carrito
                </Button>
            </div>
        </BS.Card>
    );
};

export default ProductCard;
