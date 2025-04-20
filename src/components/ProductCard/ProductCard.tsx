import classNames from 'classnames';
import * as BS from 'react-bootstrap';
import { formatCurrency } from '../../app/Helpers';
import Button from '../Button/Button';
import { CSSProperties } from 'react';
import noImage from '../../assets/no_image.jpg';
import './productCard.scss';

interface IProductCardProps {
    className?: string;
    cardBodyClassName?: string;
    id: string;
    name: string;
    price: number;
    stock?: number;
    image: string;
    isInOrder: boolean;
    style?: CSSProperties;
    onViewDetails?: () => void;
    onAddToOrder: (productId: string) => void;
    onRemoveFromOrder: (productId: string) => void;
}
const ProductCard: React.FC<IProductCardProps> = ({
    className,
    // cardBodyClassName,
    name,
    image,
    price,
    style,
    isInOrder,
    onViewDetails = () => {},
    onAddToOrder = () => {},
    onRemoveFromOrder = () => {},
    ...props
}) => {
    return (
        <BS.Card style={{ ...style, height: style?.height || '400px' }} className={classNames('p-2 product-card', className)}>
            <BS.CardBody className="p-1">
                <BS.Row className="flex-column h-100 m-0">
                    <BS.Col xs={10} className="w-100 p-0 d-flex flex-column" style={{ flex: 1 }}>
                        <div className="img-container mb-3 p-0 w-100 ">
                            <BS.Image src={image || noImage} className="w-100 h-100" />
                        </div>
                        <div className="product-card-details mb-1 w-100">
                            <h5 className="text-center w-100">{name}</h5>
                            <span className="text-center bold price w-100">{formatCurrency(price)}</span>
                        </div>
                    </BS.Col>
                    <BS.Col xs={2} className="w-100 p-0">
                        <BS.Row className="flex-column g-1">
                            <BS.Col xs={12}>
                                <Button className="btn-sm w-100" onClick={onViewDetails}>
                                    Ver detalles
                                </Button>
                            </BS.Col>
                            <BS.Col xs={12}>
                                {isInOrder ? (
                                    <Button
                                        className="bg-danger btn-sm border-0 w-100"
                                        onClick={onRemoveFromOrder ? () => onRemoveFromOrder(props.id) : () => {}}
                                    >
                                        Quitar del carrito
                                    </Button>
                                ) : (
                                    <Button
                                        className="bg-success btn-sm border-0 w-100"
                                        onClick={onAddToOrder ? () => onAddToOrder(props.id) : () => {}}
                                    >
                                        Agregar a carrito
                                    </Button>
                                )}
                            </BS.Col>
                        </BS.Row>
                    </BS.Col>
                </BS.Row>
            </BS.CardBody>
        </BS.Card>
        // <BS.Card style={{ ...style, height: style?.height || '450px' }} className={classNames('p-2 product-card', className)}>
        //     <BS.CardBody className={classNames(cardBodyClassName, 'p-0 d-flex flex-column')}>
        //         <div className="img-container mb-3">
        //             <BS.Image src={image || noImage} className="w-100 h-100" />
        //         </div>
        //         <div className="product-card-details mb-1">
        //             <h5 className="text-center w-100">{name}</h5>
        //             <h6 className="text-center w-100 product-card-description">{description}</h6>
        //             <span className="text-center bold price w-100">{formatCurrency(price)}</span>
        //         </div>
        //     </BS.CardBody>
        //     <div className="product-card-footer p-2 d-flex flex-column">
        //         <Button className="btn-sm" onClick={onViewDetails}>
        //             Ver detalles
        //         </Button>
        //         {isInOrder ? (
        //             <Button className="bg-danger btn-sm border-0" onClick={onRemoveFromOrder ? () => onRemoveFromOrder(props.id) : () => {}}>
        //                 Quitar del carrito
        //             </Button>
        //         ) : (
        //             <Button className="bg-success btn-sm border-0" onClick={onAddToOrder ? () => onAddToOrder(props.id) : () => {}}>
        //                 Agregar a carrito
        //             </Button>
        //         )}
        //     </div>
        // </BS.Card>
    );
};

export default ProductCard;
