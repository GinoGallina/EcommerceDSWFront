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
    sessionExpiration: string;
    user: {
        id: string;
        roles: string;
        username: string;
        email: string;
        address: string;
    };
}
