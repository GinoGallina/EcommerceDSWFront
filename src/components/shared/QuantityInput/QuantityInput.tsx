import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Input from '../../Input/Input';
import { useOrder } from '../../../contexts/OrderContext';
import './quantityInput.scss';
import { ADD, ICartAction, MINUS, REPLACE } from '../../../app/constants/Shared';

interface QuantityInputProps {
    quantity: number;
    productId: string;
    quantityInputClassName?: string;
    alignDirection?: string;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ quantity, productId, alignDirection = 'center', quantityInputClassName = '' }) => {
    const { updateQuantity } = useOrder();

    const handleClickQuantityButton = (id: string, action: ICartAction, value?: string) => {
        updateQuantity(id, action, value);
    };

    return (
        <div className={`d-flex quantity-input justify-content-${alignDirection} ${quantityInputClassName}`}>
            <FontAwesomeIcon
                className="my-auto p-1 me-1 icon-minus"
                onClick={() => handleClickQuantityButton(productId, MINUS)}
                icon={faMinus}
                color="white"
                size="sm"
            />
            <div className="w-25">
                <Input value={quantity.toString()} type="number" onChange={(v) => handleClickQuantityButton(productId, REPLACE, v)} minValue={0} />
            </div>
            <FontAwesomeIcon
                className="my-auto p-1 ms-1 icon-plus"
                onClick={() => handleClickQuantityButton(productId, ADD)}
                icon={faPlus}
                color="white"
                size="sm"
            />
        </div>
    );
};

export default QuantityInput;
