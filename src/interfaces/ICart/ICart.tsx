export interface ICartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

// Confirm
export interface IConfirmCartRequest {
    PaymentTypeId: string;
    Items: { ProductId: string; Quantity: number }[];
}
// export interface IConfirmCartResponse {}
