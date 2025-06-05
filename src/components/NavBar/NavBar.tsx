import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClipboard,
    faClipboardList,
    faCreditCard,
    faHouse,
    faList,
    faStore,
    // faCashRegister,
    faUsers,
    faCartShopping,
} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../Tooltip/Tooltip';
import { Link } from 'react-router-dom';
import App from '../../app/App';
import './navbar.scss';

const NavBar = () => {
    return (
        <aside className="custom-navbar">
            <ul>
                {/* General */}
                <li className="mt-3">
                    <Tooltip text="Inicio" placement="right">
                        <Link to="/">
                            <FontAwesomeIcon icon={faHouse} />
                        </Link>
                    </Tooltip>
                </li>

                <hr className="mx-3 my-3" style={{ color: 'white' }} />

                <li className="mt-3">
                    <Tooltip text="Productos" placement="right">
                        <Link to="/productos/list">
                            <FontAwesomeIcon icon={faCartShopping} />
                        </Link>
                    </Tooltip>
                </li>

                <li className="mt-3">
                    <Tooltip text="Mis Compras" placement="right">
                        <Link to="/ordenes/misCompras">
                            <FontAwesomeIcon icon={faClipboard} />
                        </Link>
                    </Tooltip>
                </li>

                {/* Admin */}
                {App.isAdmin() && (
                    <>
                        <hr className="mx-3 my-3" style={{ color: 'white' }} />

                        <li className="mt-3">
                            <Tooltip text="Categorías" placement="right">
                                <Link to="/categorias/list">
                                    <FontAwesomeIcon icon={faList} />
                                </Link>
                            </Tooltip>
                        </li>

                        <li className="mt-3">
                            <Tooltip text="Todos  los productos" placement="right">
                                <Link to="/misProductos/list">
                                    <FontAwesomeIcon icon={faClipboardList} />
                                </Link>
                            </Tooltip>
                        </li>

                        <li className="mt-3">
                            <Tooltip text="Métodos de pago" placement="right">
                                <Link to="/metodosPago/list">
                                    <FontAwesomeIcon icon={faCreditCard} />
                                </Link>
                            </Tooltip>
                        </li>

                        <li className="mt-3">
                            <Tooltip text="Usuarios" placement="right">
                                <Link to="/usuarios/list">
                                    <FontAwesomeIcon icon={faUsers} />
                                </Link>
                            </Tooltip>
                        </li>
                    </>
                )}

                {/* Seller */}
                {App.isSeller() && (
                    <>
                        <hr className="mx-3 my-3" style={{ color: 'white' }} />

                        <li className="mt-3">
                            <Tooltip text="Mis Productos" placement="right">
                                <Link to="/misProductos/list">
                                    <FontAwesomeIcon icon={faStore} />
                                </Link>
                            </Tooltip>
                        </li>
                        {/* 
                        <li className="mt-3">
                            <Tooltip text="Mis Ventas" placement="right">
                                <Link to="/ventas/list">
                                    <FontAwesomeIcon icon={faCashRegister} />
                                </Link>
                            </Tooltip>
                        </li> */}
                    </>
                )}
            </ul>
        </aside>
    );
};

export default NavBar;
