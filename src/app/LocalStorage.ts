import * as Constants from './constants/StorageKey';
import secureLocalStorage from 'react-secure-storage';
import { LocalStorageKeys } from './constants/StorageKey';
import { ICartItem } from '../interfaces/ICart/ICart';

// Set & remove data from local storage
const set = (key: LocalStorageKeys, value: string) => {
    return secureLocalStorage.setItem(key, JSON.stringify(value));
};

const get = (key: LocalStorageKeys): string => {
    const value = secureLocalStorage.getItem(key)?.toLocaleString();
    return value ? JSON.parse(value) : '';
};

export class LocalStorage {
    static setToken = (v: string) => set(Constants.TOKEN, v);
    static getToken = () => get(Constants.TOKEN);

    static setUserId = (v: string) => set(Constants.USER_ID, v);
    static getUserId = () => get(Constants.USER_ID);

    // TODO: should be string[]
    static setUserRoles = (v: string) => set(Constants.USER_ROLES, v);
    static getUserRoles = () => get(Constants.USER_ROLES);

    static setUserName = (v: string) => set(Constants.USER_NAME, v);
    static getUserName = () => get(Constants.USER_NAME);

    static setUserEmail = (v: string) => set(Constants.USER_EMAIL, v);
    static getUserEmail = () => get(Constants.USER_EMAIL);

    static setSessionExpiration = (v: string) => set(Constants.SESSION_EXPIRATION, v);
    static getSessionExpiration = () => get(Constants.SESSION_EXPIRATION);

    static setCartItems = (cart: ICartItem[]) => set(Constants.CART_ITEMS, JSON.stringify(cart));
    static getCartItems = (): ICartItem[] => {
        const cart = get(Constants.CART_ITEMS);
        return cart ? JSON.parse(cart) : [];
    };

    static clearSessionData = () => {
        secureLocalStorage.clear();
    };
}
