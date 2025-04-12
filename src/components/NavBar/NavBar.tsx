import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faHouse, faList, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../Tooltip/Tooltip';
import { Link } from 'react-router-dom';
import './navbar.scss';
import App from '../../app/App';

const NavBar = () => {
    return (
        <aside className="custom-navbar">
            <ul>
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
                            <FontAwesomeIcon icon={faBoxOpen} />
                        </Link>
                    </Tooltip>
                </li>
                <hr className="mx-3 my-3" style={{ color: 'white' }} />
                <li className="mt-3">
                    <Tooltip text="Categorias" placement="right">
                        <Link to="/categorias/list">
                            <FontAwesomeIcon icon={faList} />
                        </Link>
                    </Tooltip>
                </li>
                <hr className="mx-3 my-3" style={{ color: 'white' }} />
                <li className="mt-3">
                    <Tooltip text="Mis Productos" placement="right">
                        <Link to="/misProductos/list">
                            <FontAwesomeIcon icon={faBoxOpen} />
                        </Link>
                    </Tooltip>
                </li>
                <hr className="mx-3 my-3" style={{ color: 'white' }} />
                <li className="mt-3">
                    <Tooltip text="Métodos de pago" placement="right">
                        <Link to="/metodosPago/list">
                            <FontAwesomeIcon icon={faMoneyBill} />
                        </Link>
                    </Tooltip>
                </li>
                <hr className="mx-3 my-3" style={{ color: 'white' }} />
                {App.isSeller() && (
                    <>
                        <li className="mt-3">
                            <Tooltip text="Mis Productos" placement="right">
                                <Link to="/misProductos/list">
                                    <FontAwesomeIcon icon={faBoxOpen} />
                                </Link>
                            </Tooltip>
                        </li>
                        <hr className="mx-3 my-3" style={{ color: 'white' }} />
                    </>
                )}
            </ul>
        </aside>
    );
};

export default NavBar;
