import { IGenericGetAllResponse, IGenericList } from '../shared/IGenericRequest';

export interface IUserForm {
    username: string;
    email: string;
    password?: string;
    address: string;
    roles: string[];
    storeName?: string;
    storeDescription?: string;
    cbu?: string;
    cuit?: string;
}

// User List
export interface IGetAllUserResponse extends IGenericGetAllResponse {
    users: IUserList[];
}
export interface IUserList extends IGenericList {
    username: string;
    email: string;
    address: string;
    storeName?: string;
    storeDescription?: string;
}

// Create User
export interface ICreateUserRequest {
    Id?: string;
    Username: string;
    Email: string;
    Password?: string;
    Address: string;
    Roles: string[];
    StoreName?: string;
    StoreDescription?: string;
    Cbu?: string;
    Cuit?: string;
}

export interface ICreateUserResponse {
    id: string;
    username: string;
    email: string;
    address: string;
    roles: string[];
    storeName?: string;
    storeDescription?: string;
    cbu?: string;
    cuit?: string;
    createdAt: string;
}
