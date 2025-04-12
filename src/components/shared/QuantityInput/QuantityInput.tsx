import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './quantityInput.scss';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Input from '../../Input/Input';
import { ADD, MINUS } from '../../TopBar/TopBar.const';
import { LocalStorage } from '../../../app/LocalStorage';
import { ICartItem } from '../../../interfaces/ICart/ICart';

interface QuantityInputProps {
    quantity: number;
    productId: string;
    xs: number;
    md: number;
    setCart: React.Dispatch<React.SetStateAction<ICartItem[]>>;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ quantity, productId, setCart, xs = 6, md = 3 }) => {
    const handleClickQuantityButton = (id: string, action: string) => {
        let newCart;
        setCart((prevCart) => {
            newCart = prevCart.map((x) => {
                if (x.productId === id) {
                    if (action === MINUS && x.quantity === 0) return x;
                    return {
                        ...x,
                        quantity: action === ADD ? x.quantity + 1 : x.quantity - 1,
                    };
                }
                return x;
            });
            return newCart;
        });
        if (newCart) LocalStorage.setCartItems(newCart);
    };
    return (
        <Col xs={xs} md={md} className="d-flex quantity-input justify-content-center">
            <FontAwesomeIcon
                className="my-auto p-1 me-1 icon-minus"
                onClick={() => handleClickQuantityButton(productId, MINUS)}
                icon={faMinus}
                color="white"
                size="sm"
            />
            <div className="w-25">
                <Input
                    value={quantity.toString()}
                    type="number"
                    // onChange={(v) => handleChangeItemQuantity2(v, product.productId)}
                    minValue={0}
                />
            </div>
            <FontAwesomeIcon
                className="my-auto p-1 ms-1 icon-plus"
                onClick={() => handleClickQuantityButton(productId, ADD)}
                icon={faPlus}
                color="white"
                size="sm"
            />
        </Col>
    );
};

export default QuantityInput;
