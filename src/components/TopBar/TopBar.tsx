import { Image } from 'react-bootstrap';
import { useRef, useState, MouseEvent, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import LogoMini from '../../assets/logo-mini.png';
import Logo from '../../assets/ecommerce-logo-topbar.webp';
// import SidePanel from '../SidePanel/SidePanel';
import UserDetails from './UserDetails';
import CartMenu from './Cart/CartMenu';
import './topbar.scss';
import { LocalStorage } from '../../app/LocalStorage';

const TopBar = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(LocalStorage.getCartItems());
    const [showUser, setShowUser] = useState(false);
    const [showCart, setShowCart] = useState(false);

    // const [showSidePanel, setShowSidePanel] = useState(false);
    // const [showNotifications, setShowNotifications] = useState(false);

    const userInfoRef = useRef<HTMLDivElement | null>(null);
    // const notificationsRef = useRef(null);
    const userIconRef = useRef<SVGSVGElement | null>(null);
    const cartIconRef = useRef<SVGSVGElement | null>(null);

    const handleShowUserInfo = () => {
        // setShowNotifications(false);
        setShowCart(false);
        setShowUser((prevShowUser) => !prevShowUser);
        if (userInfoRef.current) userInfoRef.current.focus();
    };

    const handleShowCart = () => {
        // setShowNotifications(false);
        setShowUser(false);
        setShowCart((prevShowCart) => !prevShowCart);
        if (cartIconRef.current) cartIconRef.current.focus();
    };

    const handleHideUserInfo = () => {
        setShowUser(false);
    };

    const handleGoHome = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/');
    };

    // const toggleSidePanel = () => {
    //     setShowSidePanel((prevShowSidePanel) => !prevShowSidePanel);
    // };

    // const handleHideSidePanel = () => {
    //     setShowSidePanel(false);
    // };

    // Handle click outside of notifications container
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
    //             setShowNotifications(false);
    //         }
    //     };

    //     if (showNotifications) {
    //         document.addEventListener('mousedown', handleClickOutside);
    //     } else {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     }

    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [showNotifications]);

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
            // TODO;
            // if (
            //     cartIconRef.current &&
            //     !cartIconRef.current.contains(event.target as Node) &&
            //     userIconRef.current &&
            //     !userIconRef.current.contains(event.target as Node)
            // ) {
            //     setShowCart(false);
            // }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUser]);

    return (
        <>
            {/* <SidePanel isOpen={showSidePanel} onClose={handleHideSidePanel} /> */}
            <nav className="custom-topbar">
                <div className="image-container">
                    <a href="/" onClick={handleGoHome}>
                        <Image src={Logo} className="logo" alt="Inicio" />
                        <Image src={LogoMini} className="logo-mini" alt="Inicio" />
                    </a>
                    <div className="bars-container">
                        {/* <FontAwesomeIcon icon={faBars} size="lg" className="menu-icon" onClick={toggleSidePanel} /> */}
                    </div>
                </div>
                <div className="d-flex flex-row">
                    <span className={classNames('icon-container', 'position-relative')} onClick={handleShowCart}>
                        <FontAwesomeIcon icon={faCartShopping} size="xl" ref={cartIconRef} />
                        {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                    </span>
                    <span className={classNames('icon-container', showUser && 'show-card')} onClick={handleShowUserInfo}>
                        <FontAwesomeIcon icon={faUser} size="xl" ref={userIconRef} />
                    </span>
                </div>
                {/* Cart */}
                <CartMenu cart={cart} showCart={showCart} userInfoRef={userInfoRef} setShowCart={setShowCart} setCart={setCart} />
                {/* User details */}
                <div className={classNames('user-container', showUser && 'show-card')} onBlur={handleHideUserInfo} ref={userInfoRef}>
                    <UserDetails setShowUser={setShowUser} handleHideUserInfo={handleHideUserInfo} />
                </div>
            </nav>
        </>
    );
};

export default TopBar;
