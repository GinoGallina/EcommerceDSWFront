import { createContext, useContext, useState } from 'react';
import { LocalStorage } from '../app/LocalStorage';
import { IOrderItem } from '../interfaces/IOrder/IOrder';
import { ADD, ICartAction, MINUS, REPLACE } from '../app/constants/Shared';

interface IOrderContextType {
    orderItems: IOrderItem[];
    addToOrder: (item: IOrderItem) => void;
    removeFromOrder: (productId: string) => void;
    setOrderItems: (items: IOrderItem[]) => void;
    updateQuantity: (productId: string, action: ICartAction, value?: string) => void;
    cleanOrder: () => void;
}

const OrderContext = createContext<IOrderContextType | null>(null);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
    const [orderItems, setOrderItemsState] = useState<IOrderItem[]>(LocalStorage.getOrderItems() || []);

    const setOrderItems = (items: IOrderItem[]) => {
        LocalStorage.setOrderItems(items);
        setOrderItemsState(items);
    };

    const cleanOrder = () => {
        LocalStorage.setOrderItems([]);
        setOrderItemsState([]);
    };

    const addToOrder = (item: IOrderItem) => {
        if (!orderItems.find((i) => i.productId === item.productId)) {
            const newItems = [...orderItems, item];
            setOrderItems(newItems);
        }
    };

    const removeFromOrder = (productId: string) => {
        const newItems = orderItems.filter((i) => i.productId !== productId);
        setOrderItems(newItems);
    };

    const updateQuantity = (productId: string, action: ICartAction, value?: string) => {
        const updatedItems = orderItems
            .map((item) => {
                if (item.productId === productId) {
                    let newQuantity: number;
                    const finalValue = Number(value) || 0;

                    switch (action) {
                        case ADD:
                            newQuantity = item.quantity + 1;
                            break;
                        case MINUS:
                            newQuantity = item.quantity - 1 < 0 ? 0 : item.quantity - 1;
                            break;
                        case REPLACE:
                            newQuantity = finalValue < 0 ? 0 : finalValue;
                            break;
                        default:
                            newQuantity = item.quantity;
                            break;
                    }
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
            .filter(Boolean) as IOrderItem[];

        setOrderItems(updatedItems);
    };

    return (
        <OrderContext.Provider value={{ orderItems, addToOrder, removeFromOrder, setOrderItems, updateQuantity, cleanOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder debe usarse dentro de un OrderProvider');
    }
    return context;
};
