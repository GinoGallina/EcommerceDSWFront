import { BreadCrumbItem } from '../../components/BreadCrumb/BreadCrumb';

export const getBreadcrumbItems = (label: string) => {
    const items: BreadCrumbItem[] = [
        {
            active: label ? false : true,
            url: '/categorias/list',
            label: 'Categorias',
        },
    ];

    if (label) {
        items.push({
            active: true,
            label,
        });
    }

    return items;
};
