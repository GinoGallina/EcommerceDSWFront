import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Image, Row } from 'react-bootstrap';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import noImage from '../../..//assets/no_image.jpg';
import { IOrderItem } from '../../../interfaces/IOrder/IOrder';
import { formatCurrency } from '../../../app/Helpers';
import QuantityInput from '../../shared/QuantityInput/QuantityInput';
import { useOrder } from '../../../contexts/OrderContext';

interface IOrderMenuItemProps {
    product: IOrderItem;
    idx: number;
}

const OrderMenuItem: React.FC<IOrderMenuItemProps> = ({ product, idx }) => {
    const handleRemoveItemFromOrder = (id: string) => {
        removeFromOrder(id);
    };

    const { removeFromOrder } = useOrder();

    return (
        <Row className={`${idx % 2 === 0 ? 'bg-alternate' : ''}`}>
            <Col xs={3} className="d-flex">
                <Image
                    className="mx-auto my-auto"
                    src={product.image || noImage}
                    alt="Producto"
                    fluid
                    rounded
                    style={{ maxHeight: '100px', objectFit: 'contain', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                />
            </Col>
            <Col xs={8} className="order-details d-flex flex-column p-2">
                <h4 className="fs-4" style={{ wordBreak: 'break-word' }}>
                    {product.name}
                </h4>
                <div>
                    <p className="mb-0">
                        Precio unitario: <span className="text-success">${product.price}</span>
                    </p>
                </div>
                <div className="mt-2">
                    <Row>
                        <Col xs={5}>
                            <QuantityInput alignDirection="start" quantity={product.quantity} productId={product.productId} />
                        </Col>
                        <Col xs={7} className="text-end">
                            <p className="mb-0">
                                <span className="fs-4 text-success text-end">Total: {formatCurrency(product.price * product.quantity)}</span>
                            </p>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col xs={1} className="d-flex my-auto ms-1 remove-item">
                <FontAwesomeIcon onClick={() => handleRemoveItemFromOrder(product.productId)} icon={faClose} color="red" size="xl" />
            </Col>
        </Row>
    );
};

export default OrderMenuItem;
