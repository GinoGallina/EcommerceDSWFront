import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './layouts/Routes';
import './scss/app.scss';

const container = document.getElementById('root');

if (!container)
    throw new Error(
        "No se encontró el elemento con id 'root'. Asegúrate de que index.html contiene <div id='root'></div>"
    );

const root = createRoot(container);

const comp = (
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>
);

root.render(comp);
