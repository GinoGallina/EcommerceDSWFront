import { formatCurrency } from '../../app/Helpers';
import Button from '../Button/Button';
import { CSSProperties } from 'react';
import noImage from '../../assets/no_image.jpg';
import './productCard.scss';
import { Card } from 'react-bootstrap';
import { StarRating } from '../../screens/products/StarRating';

interface IProductCardProps {
    cardBodyClassName?: string;
    id: string;
    name: string;
    price: number;
    stock?: number;
    categoryName: string;
    image: string;
    rating: {
        rate: number;
        totalReviews: number;
    };
    isInOrder: boolean;
    style?: CSSProperties;
    onViewDetails?: () => void;
    onAddToOrder: (productId: string) => void;
    onRemoveFromOrder: (productId: string) => void;
}
const ProductCard: React.FC<IProductCardProps> = ({
    name,
    image,
    price,
    stock,
    style,
    categoryName,
    rating,
    isInOrder,
    onViewDetails = () => {},
    onAddToOrder = () => {},
    onRemoveFromOrder = () => {},
    ...props
}) => {
    return (
        <Card className="h-100 product-card position-relative" style={{ ...style }}>
            <Card.Img variant="top" src={image || noImage} style={{ objectFit: 'fill', height: '250px' }}></Card.Img>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-3 product-card-title">{name}</Card.Title>
                <Card.Text className="text-muted mb-3 product-card-category">Categoría: {categoryName}</Card.Text>
                <div className="mb-3">
                    <StarRating rate={rating.rate} totalReviews={rating.totalReviews} onChange={() => {}} readOnly></StarRating>
                </div>
                <Card.Text className="fw-bold text-success">{formatCurrency(price)}</Card.Text>
                <div className="mt-auto d-flex flex-column flex-xxl-row justify-content-between">
                    <Button size="sm" className="mb-3 mb-xxl-0" onClick={onViewDetails}>
                        Ver más
                    </Button>
                    {isInOrder ? (
                        <Button variant="danger" size="sm" onClick={() => onRemoveFromOrder(props.id)}>
                            Quitar del carrito
                        </Button>
                    ) : (
                        <Button variant="success" size="sm" disabled={stock === 0} onClick={() => onAddToOrder(props.id)}>
                            Agregar al carrito
                        </Button>
                    )}
                </div>
            </Card.Body>
            {stock === 0 && <span className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small rounded-end">Sin stock</span>}
        </Card>
    );
};

export default ProductCard;
