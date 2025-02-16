export interface TokenData {
    token: string;
    sessionExpiration: string;
    user: {
        id: string;
        role: string;
        fullName: string;
        email: string;
    };
}
