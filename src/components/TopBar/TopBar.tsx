import { Image } from 'react-bootstrap';
import { useRef, useState, MouseEvent, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose, faUser } from '@fortawesome/free-solid-svg-icons';
import { LocalStorage } from '../../app/LocalStorage';
import classNames from 'classnames';
import API from '../../app/API';
import Button from '../Button/Button';
import { useNavigate } from 'react-router';
import LogoMini from '../../assets/logo-mini.png';
import Logo from '../../assets/ecommerce-logo-topbar.webp';
import Loader from '../Loader/Loader';
import Toast from '../Toast/Toast';
// import SidePanel from '../SidePanel/SidePanel';

import './topbar.scss';

const TopBar = () => {
    const navigate = useNavigate();
    const [showUser, setShowUser] = useState(false);
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(false);

    const userInfoRef = useRef<HTMLDivElement | null>(null);
    // const notificationsRef = useRef(null);
    const userIconRef = useRef<SVGSVGElement | null>(null);

    const handleShowUserInfo = () => {
        setShowNotifications(false);
        setShowUser((prevShowUser) => !prevShowUser);
        if (userInfoRef.current) userInfoRef.current.focus();
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

    // const handleHideSidePanel = () => {
    //     setShowSidePanel(false);
    // };

    const handleLogout = () => {
        setLoading(true);
        API.post('auth/logout', null)
            .then(() => {
                LocalStorage.clearSessionData();
                window.location.href = '/login';
            })
            .catch((r) => {
                Toast.error(r.error?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handlePerfilDetails = () => {
        setShowUser(false);
        navigate(`/usuario/detallesPerfil/${LocalStorage.getUserId()}`);
    };

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
                        <FontAwesomeIcon
                            icon={faBars}
                            size="lg"
                            className="menu-icon"
                            onClick={toggleSidePanel}
                        />
                    </div>
                </div>
                <div className="d-flex flex-row">
                    <span
                        className={classNames('icon-container', showUser && 'show-card')}
                        onClick={handleShowUserInfo}
                    >
                        <FontAwesomeIcon icon={faUser} size="xl" ref={userIconRef} />
                    </span>
                </div>
                <div
                    className={classNames('user-container', showUser && 'show-card')}
                    onBlur={handleHideUserInfo}
                    ref={userInfoRef}
                >
                    <FontAwesomeIcon
                        icon={faClose}
                        size="sm"
                        className="close-dialog"
                        onClick={handleHideUserInfo}
                    />
                    <div className="user-info">
                        <div className="user-icon">
                            <FontAwesomeIcon icon={faUser} size="xl" />
                        </div>
                        <div className="user-data">
                            <h5>{LocalStorage.getUserName()}</h5>
                            <h6>{LocalStorage.getUserEmail()}</h6>
                            <small>Rol: {LocalStorage.getUserRole()}</small>
                        </div>
                    </div>
                    <div>
                        <Button
                            className="perfil-details-badge"
                            type="button"
                            onClick={handlePerfilDetails}
                        >
                            Ver perfil
                        </Button>
                        <hr />
                        <Button
                            className="logout-badge"
                            type="button"
                            onClick={handleLogout}
                            disabled={loading}
                        >
                            {loading ? <Loader /> : 'Cerrar sesión'}
                        </Button>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default TopBar;
