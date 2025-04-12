import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faUser } from '@fortawesome/free-solid-svg-icons';
import { LocalStorage } from '../../app/LocalStorage';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';

interface IUserDetailsProps {
    handleHideUserInfo: () => void;
    setShowUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDetails: React.FC<IUserDetailsProps> = ({ handleHideUserInfo, setShowUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        LocalStorage.clearSessionData();
        navigate('/');
    };

    const handlePerfilDetails = () => {
        setShowUser(false);
        navigate(`/usuario/detallesPerfil/${LocalStorage.getUserId()}`);
    };
    return (
        <>
            <FontAwesomeIcon icon={faClose} size="sm" className="close-dialog" onClick={handleHideUserInfo} />
            <div className="user-info">
                <div className="user-icon">
                    <FontAwesomeIcon icon={faUser} size="xl" />
                </div>
                <div className="user-data">
                    <h5>{LocalStorage.getUserName()}</h5>
                    <h6>{LocalStorage.getUserEmail()}</h6>
                    <small>Rol: {LocalStorage.getUserRoles()}</small>
                </div>
            </div>
            <div>
                <Button className="perfil-details-badge" type="button" onClick={handlePerfilDetails}>
                    Ver perfil
                </Button>
                <hr />
                <Button className="logout-badge" type="button" onClick={handleLogout}>
                    {'Cerrar sesión'}
                </Button>
            </div>
        </>
    );
};

export default UserDetails;
