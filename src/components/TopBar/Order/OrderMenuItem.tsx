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
            <Col xs={3} className="img-container d-flex my-auto">
                <Image src={product.image || noImage} className="w-100 h-100" />
            </Col>
            <Col xs={8} className="order-details d-flex flex-column p-2">
                <div className="fs-4">{product.name}</div>
                <div>
                    Precio unitario: <span className="text-success">${product.price}</span>
                </div>
                <div className="mt-2">
                    <Row>
                        <Col xs={5}>
                            <QuantityInput quantity={product.quantity} productId={product.productId} />
                        </Col>
                        <Col xs={7} className="text-end">
                            <span className="fs-4 text-success text-end">Total: {formatCurrency(product.price * product.quantity)}</span>
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
