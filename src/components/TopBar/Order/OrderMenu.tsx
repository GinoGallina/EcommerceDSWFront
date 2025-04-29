import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import OrderMenuItem from './OrderMenuItem';
import Button from '../../Button/Button';
import { formatCurrency } from '../../../app/Helpers';
import { faClose, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { IOrderItem } from '../../../interfaces/IOrder/IOrder';

interface IOrderMenuProps {
    order: IOrderItem[];
    showOrder: boolean;
    userInfoRef: React.RefObject<HTMLDivElement | null>;
    setShowOrder: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrderMenu: React.FC<IOrderMenuProps> = ({ order, showOrder, userInfoRef, setShowOrder }) => {
    const navigate = useNavigate();

    const handleOrder = () => {
        setShowOrder(false);
    };

    return (
        <div className={classNames('order-container', showOrder && 'show-card')} onBlur={handleOrder} ref={userInfoRef}>
            <FontAwesomeIcon icon={faClose} size="sm" className="close-dialog" onClick={handleOrder} />
            {order.map((x, idx) => (
                <OrderMenuItem key={idx} idx={idx} product={x} />
            ))}
            <hr />
            <div className={classNames('text-end fs-3 text-success d-flex justify-content-between', order.length === 0 && 'mt-auto')}>
                Total del carrito: {formatCurrency(order.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                {order.length !== 0 && (
                    <Button
                        variant="success"
                        onClick={() => {
                            navigate('/carrito/confirmar');
                        }}
                        icon={faShoppingBag}
                    >
                        Comprar
                    </Button>
                )}
            </div>
        </div>
    );
};

export default OrderMenu;
