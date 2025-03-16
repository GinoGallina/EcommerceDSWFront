import { useState } from 'react';
import { Dropdown } from '../..';
import { DropdownOption, DropdownValue, SortRequestInterface } from '../../../interfaces';

const defaultItems = [
    { value: 'date-asc', label: 'Fecha - Asc.' },
    { value: 'date-desc', label: 'Fecha - Desc.' },
    { value: 'createdAt-asc', label: 'Creado - Asc.' },
    { value: 'createdAt-desc', label: 'Creado - Desc.' },
];

interface TableSortProps {
    items: DropdownOption[];
    onChange: (value: SortRequestInterface) => void;
}

const TableSort: React.FC<TableSortProps> = ({ items = defaultItems, onChange = () => {} }) => {
    const [selectedItem, setSelectedItem] = useState<string | null>('');

    const handleItemChange = (item: string | null) => {
        setSelectedItem(item);

        if (!item) {
            onChange({ column: null, direction: null });
            return;
        }

        const [column, direction] = item.split('-');

        onChange({ column, direction });
    };

    return (
        <Dropdown
            items={items}
            value={selectedItem && selectedItem}
            placeholder="Ordenar por"
            clearable
            onChange={handleItemChange as (value: DropdownValue) => void}
        />
    );
};

export default TableSort;
