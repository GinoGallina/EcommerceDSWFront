import { Roles } from './constants/Roles';
import { LocalStorage } from './LocalStorage';

const isLoggedIn = () => {
    if (!LocalStorage.getUserId()) return false;

    const sessionExpiration = new Date(LocalStorage.getSessionExpiration());

    if (!sessionExpiration) return false;

    if (new Date() > sessionExpiration) {
        LocalStorage.clearSessionData();
        return false;
    }

    return true;
};

const isAdmin = () => {
    const roles = LocalStorage.getUserRoles();
    return roles && roles.includes(Roles.Admin);
};

const isSeller = () => {
    const roles = LocalStorage.getUserRoles();
    return roles && roles.includes(Roles.Seller);
};

const isUser = () => {
    const roles = LocalStorage.getUserRoles();
    return roles && roles.includes(Roles.User);
};

const App = {
    isLoggedIn,
    isAdmin,
    isSeller,
    isUser,
};

export default App;
