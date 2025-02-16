import * as Constants from './constants/StorageKey';
import secureLocalStorage from 'react-secure-storage';
import { LocalStorageKeys } from './constants/StorageKey';

// Set & remove data from local storage
const set = (key: LocalStorageKeys, value: string) => {
    return secureLocalStorage.setItem(key, JSON.stringify(value));
};

const get = (key: LocalStorageKeys): string => {
    const value = secureLocalStorage.getItem(key)?.toLocaleString();
    return value ? JSON.parse(value) : null;
};

export class LocalStorage {
    static setToken = (v: string) => set(Constants.TOKEN, v);
    static getToken = () => get(Constants.TOKEN);

    static setUserId = (v: string) => set(Constants.USER_ID, v);
    static getUserId = () => get(Constants.USER_ID);

    static setUserRole = (v: string) => set(Constants.USER_ROLE, v);
    static getUserRole = () => get(Constants.USER_ROLE);

    static setUserName = (v: string) => set(Constants.USER_NAME, v);
    static getUserName = () => get(Constants.USER_NAME);

    static setUserEmail = (v: string) => set(Constants.USER_EMAIL, v);
    static getUserEmail = () => get(Constants.USER_EMAIL);

    static setSessionExpiration = (v: string) => set(Constants.SESSION_EXPIRATION, v);
    static getSessionExpiration = () => get(Constants.SESSION_EXPIRATION);

    static clearSessionData = () => {
        secureLocalStorage.clear();
    };
}
