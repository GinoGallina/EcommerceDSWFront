import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Image, Row } from 'react-bootstrap';
import { faClose, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import noImage from '../../..//assets/no_image.jpg';
import { IOrderItem } from '../../../interfaces/IOrder/IOrder';
import { ADD, MINUS } from '../TopBar.const';
import { LocalStorage } from '../../../app/LocalStorage';
import Input from '../../Input/Input';
import { formatCurrency } from '../../../app/Helpers';

interface IOrderMenuItemProps {
    product: IOrderItem;
    order: IOrderItem[];
    setOrder: React.Dispatch<React.SetStateAction<IOrderItem[]>>;
}

const OrderMenuItem: React.FC<IOrderMenuItemProps> = ({ product, order, setOrder }) => {
    const handleClickQuantityButton = (id: string, action: string) => {
        let newOrder;
        setOrder((prevOrder) => {
            newOrder = prevOrder.map((x) => {
                if (x.productId === id) {
                    if (action === MINUS && x.quantity === 0) return x;
                    return {
                        ...x,
                        quantity: action === ADD ? x.quantity + 1 : x.quantity - 1,
                    };
                }
                return x;
            });
            return newOrder;
        });
        if (newOrder) LocalStorage.setOrderItems(newOrder);
    };

    const handleChangeItemQuantity = (value: string, id: string) => {
        let newOrder;
        setOrder((prevOrder) => {
            newOrder = prevOrder.map((x) => {
                if (x.productId === id) {
                    return {
                        ...x,
                        quantity: Number(value),
                    };
                }
                return x;
            });
            return newOrder;
        });
        if (newOrder) LocalStorage.setOrderItems(newOrder);
    };

    const handleRemoveItemFromOrder = (id: string) => {
        const newOrder = order.filter((x) => x.productId !== id);
        setOrder(newOrder);
        LocalStorage.setOrderItems(newOrder);
    };

    return (
        <Row>
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
                        <Col xs={4} className="d-flex">
                            <FontAwesomeIcon
                                className="my-auto p-1 me-1"
                                onClick={() => handleClickQuantityButton(product.productId, MINUS)}
                                icon={faMinus}
                                size="sm"
                            />
                            <Input
                                value={product.quantity.toString()}
                                type="number"
                                onChange={(v) => handleChangeItemQuantity(v, product.productId)}
                                minValue={0}
                            />
                            <FontAwesomeIcon
                                className="my-auto p-1 ms-1"
                                onClick={() => handleClickQuantityButton(product.productId, ADD)}
                                icon={faPlus}
                                size="sm"
                            />
                        </Col>
                        <Col xs={8} className="text-end">
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
