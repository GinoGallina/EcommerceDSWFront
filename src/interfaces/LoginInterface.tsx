export interface TokenData {
    token: string;
    sessionExpiration: string;
    user: {
        id: string;
        roles: string;
        username: string;
        email: string;
    };
}
