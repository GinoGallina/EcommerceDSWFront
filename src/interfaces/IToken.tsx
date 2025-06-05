export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    Email: string;
    Password: string;
    Username: string;
    Address: string;
    Roles: string[];
    StoreName?: string;
    StoreDescription?: string;
    Cbu?: string;
}

export interface ITokenResponse {
    token: string;
}

export interface ITokenPayload {
    id: string;
    username: string;
    email: string;
    roles: string;
    address: string;
    // roles: string[];
    exp: number;
}
