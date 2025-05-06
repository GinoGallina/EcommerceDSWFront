import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faClipboardList, faCreditCard, faHouse, faUser, faShoppingBag, faTags, faTruck } from '@fortawesome/free-solid-svg-icons';
import App from '../../app/App';
import './SidePanel.scss';

const SidePanel = ({ isOpen = false, onClose = () => {} }) => {
    const navigate = useNavigate();

    const handleItemClick = (link: string) => {
        navigate(link);
        onClose();
    };

    return (
        <div>
            <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
            <div className={`side-panel ${isOpen ? 'open' : ''}`}>
                <span className="item-container" onClick={() => handleItemClick('/')}>
                    <FontAwesomeIcon icon={faHouse} /> Inicio
                </span>

                <hr className="my-3" />

                <span className="item-container" onClick={() => handleItemClick('/productos/list')}>
                    <FontAwesomeIcon icon={faBoxOpen} /> Productos
                </span>

                {App.isAdmin() && (
                    <>
                        <span className="item-container" onClick={() => handleItemClick('/categorias/list')}>
                            <FontAwesomeIcon icon={faTags} /> Categorías
                        </span>

                        <span className="item-container" onClick={() => handleItemClick('/misProductos/list')}>
                            <FontAwesomeIcon icon={faClipboardList} /> Listado de productos
                        </span>

                        <span className="item-container" onClick={() => handleItemClick('/metodosPago/list')}>
                            <FontAwesomeIcon icon={faCreditCard} /> Métodos de pago
                        </span>

                        <span className="item-container" onClick={() => handleItemClick('/usuarios/list')}>
                            <FontAwesomeIcon icon={faUser} /> Usuarios
                        </span>
                    </>
                )}

                {App.isSeller() && (
                    <>
                        <span className="item-container" onClick={() => handleItemClick('/misProductos/list')}>
                            <FontAwesomeIcon icon={faClipboardList} /> Mis productos
                        </span>

                        <span className="item-container" onClick={() => handleItemClick('/ventas/list')}>
                            <FontAwesomeIcon icon={faTruck} /> Mis ventas
                        </span>
                    </>
                )}

                <hr className="my-3" />

                <span className="item-container" onClick={() => handleItemClick('/ordenes/misCompras')}>
                    <FontAwesomeIcon icon={faShoppingBag} /> Mis compras
                </span>
            </div>
        </div>
    );
};

export default SidePanel;
