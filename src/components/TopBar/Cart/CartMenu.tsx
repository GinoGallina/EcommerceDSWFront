import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import CartMenuItem from './CartMenuItem';
import Button from '../../Button/Button';
import { formatCurrency } from '../../../app/Helpers';
import { faClose, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { ICartItem } from '../../../interfaces/ICart/ICart';

interface ICartMenuProps {
    cart: ICartItem[];
    setCart: React.Dispatch<React.SetStateAction<ICartItem[]>>;
    showCart: boolean;
    userInfoRef: React.RefObject<HTMLDivElement | null>;
    setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartMenu: React.FC<ICartMenuProps> = ({ cart, showCart, userInfoRef, setShowCart, setCart }) => {
    const navigate = useNavigate();

    const handleCart = () => {
        setShowCart(false);
    };

    return (
        <div className={classNames('cart-container', showCart && 'show-card')} onBlur={handleCart} ref={userInfoRef}>
            <FontAwesomeIcon icon={faClose} size="sm" className="close-dialog" onClick={handleCart} />
            {cart.map((x) => (
                <>
                    <CartMenuItem cart={cart} product={x} setCart={setCart} />
                    <hr className="mt-1" />
                </>
            ))}
            <div className={classNames('text-end fs-3 text-success d-flex justify-content-between', cart.length === 0 && 'mt-auto')}>
                {cart.length !== 0 && (
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
                Total del carrito: {formatCurrency(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}
            </div>
        </div>
    );
};

export default CartMenu;
