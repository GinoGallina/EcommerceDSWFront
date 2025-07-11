import { Image } from 'react-bootstrap';
import { useRef, useState, MouseEvent, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import Logo from '../../assets/ecommerce-logo-topbar.webp';
import UserDetails from './UserDetails';
import OrderMenu from './Order/OrderMenu';
import { useOrder } from '../../contexts/OrderContext';
import './topbar.scss';
import SidePanel from '../SidePanel/SidePanel';

const TopBar = () => {
    const navigate = useNavigate();

    const [showUser, setShowUser] = useState(false);
    const [showOrder, setShowOrder] = useState(false);

    const { orderItems } = useOrder();
    const [showSidePanel, setShowSidePanel] = useState(false);

    const userInfoRef = useRef<HTMLDivElement | null>(null);
    const userIconRef = useRef<SVGSVGElement | null>(null);
    const orderIconRef = useRef<SVGSVGElement | null>(null);

    const handleShowUserInfo = () => {
        setShowOrder(false);
        setShowUser((prevShowUser) => !prevShowUser);
        if (userInfoRef.current) userInfoRef.current.focus();
    };

    const handleShowOrder = () => {
        setShowUser(false);
        setShowOrder((prevShowOrder) => !prevShowOrder);
        if (orderIconRef.current) orderIconRef.current.focus();
    };

    const handleHideUserInfo = () => {
        setShowUser(false);
    };

    const handleGoHome = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/');
    };

    const toggleSidePanel = () => {
        setShowSidePanel((prevShowSidePanel) => !prevShowSidePanel);
    };

    const handleHideSidePanel = () => {
        setShowSidePanel(false);
    };

    // Handle click outside of user info container
    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (
                userInfoRef.current &&
                !userInfoRef.current.contains(event.target as Node) &&
                userIconRef.current &&
                !userIconRef.current.contains(event.target as Node)
            ) {
                setShowUser(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUser]);

    return (
        <>
            <SidePanel isOpen={showSidePanel} onClose={handleHideSidePanel} />
            <nav className="custom-topbar">
                <div className="image-container">
                    <a href="/" onClick={handleGoHome}>
                        <Image src={Logo} className="logo" alt="Inicio" />
                        <Image src={Logo} className="logo-mini" alt="Inicio" />
                    </a>
                    <div className="bars-container">
                        <FontAwesomeIcon icon={faBars} size="lg" className="menu-icon" onClick={toggleSidePanel} />
                    </div>
                </div>
                <div className="d-flex flex-row">
                    <span className={classNames('icon-container', 'position-relative')} onClick={handleShowOrder}>
                        <FontAwesomeIcon icon={faCartShopping} size="xl" ref={orderIconRef} />
                        {orderItems.length > 0 && <span className="order-badge">{orderItems.length}</span>}
                    </span>
                    <span className={classNames('icon-container', showUser && 'show-card')} onClick={handleShowUserInfo}>
                        <FontAwesomeIcon icon={faUser} size="xl" ref={userIconRef} />
                    </span>
                </div>
                {/* Order */}
                <OrderMenu order={orderItems} showOrder={showOrder} userInfoRef={userInfoRef} setShowOrder={setShowOrder} />
                {/* User details */}
                <div className={classNames('user-container', showUser && 'show-card')} onBlur={handleHideUserInfo} ref={userInfoRef}>
                    <UserDetails setShowUser={setShowUser} handleHideUserInfo={handleHideUserInfo} />
                </div>
            </nav>
        </>
    );
};

export default TopBar;
