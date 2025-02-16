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
    const role = LocalStorage.getUserRole();
    return role && role === Roles.Admin;
};

const isSeller = () => {
    const role = LocalStorage.getUserRole();
    return role && role === Roles.Seller;
};

const isUser = () => {
    const role = LocalStorage.getUserRole();
    return role && role === Roles.User;
};

const App = {
    isLoggedIn,
    isAdmin,
    isSeller,
    isUser,
};

export default App;
