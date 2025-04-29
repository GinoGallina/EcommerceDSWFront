import { useEffect, useState } from 'react';
import { GetComboItemType } from '../interfaces/shared/IGetCombo';

export const useDropdownItems = (ref: React.RefObject<{ items: () => GetComboItemType[] | null } | null>) => {
    const [items, setItems] = useState<GetComboItemType[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newItems = ref.current?.items?.();
            if (newItems && newItems.length > 0) {
                setItems(newItems);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [ref]);

    return items;
};
