import App from '../../app/App';
import { BreadCrumbItem } from '../../components/BreadCrumb/BreadCrumb';

export const getBreadcrumbItems = (label: string) => {
    const items: BreadCrumbItem[] = App.isAdmin()
        ? [
              {
                  active: label ? false : true,
                  url: '/usuarios/list',
                  label: 'Usuarios',
              },
          ]
        : [
              {
                  active: true,
                  label: 'Editar usuario',
              },
          ];

    if (label && App.isAdmin()) {
        items.push({
            active: true,
            label,
        });
    }

    return items;
};
