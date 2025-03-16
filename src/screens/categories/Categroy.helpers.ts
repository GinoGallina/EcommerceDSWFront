import API from '../../app/API';
import App from '../../app/App';
import { Toast } from '../../components';
import { BreadCrumbItem } from '../../components/BreadCrumb/BreadCrumb';

export const getBreadcrumbItems = (label: string) => {
    const items: BreadCrumbItem[] = [
        {
            active: label ? false : true,
            url: App.isSeller() ? '/misProductos/list' : '/productos/list',
            label: App.isSeller() ? 'Mis productos' : 'Productos',
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

export const saveProduct = (form, id, onSuccess, onError) => {
    const rq = {
        name: form.name,
        price: form.price,
        typeId: form.typeId,
    };

    if (id) {
        rq.id = id;
    }

    API.post(`product/${id ? 'update' : 'create'}`, rq)
        .then((r) => {
            Toast.success(r.message);
            onSuccess();
        })
        .catch((r) => {
            Toast.error(r.error?.message);
            onError();
        });
};
