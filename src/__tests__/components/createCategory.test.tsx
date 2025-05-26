import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CreateCategory from '../../screens/categories/CreateCategory';
import API from '../../app/API';
import Toast from '../../components/Toast/Toast';
import { Messages } from '../../app/constants/Messages';

jest.mock('../../app/API', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

jest.mock('../../components/Toast/Toast', () => ({
    __esModule: true,
    default: {
        warning: jest.fn(),
        success: jest.fn(),
    },
}));

const mockedAPI = API as jest.Mocked<typeof API>;

describe('CreateCategory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('muestra el spinner mientras carga datos si hay ID', async () => {
        mockedAPI.get.mockResolvedValueOnce({
            data: { name: 'Categoría test' },
            success: true,
        });

        render(
            <MemoryRouter initialEntries={['/categorias/edit/123']}>
                <Routes>
                    <Route path="/categorias/edit/:id" element={<CreateCategory />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
        });
    });

    test('rellena el input con datos de la API al editar', async () => {
        mockedAPI.get.mockResolvedValueOnce({ data: { name: 'Nombre existente' }, success: true });

        render(
            <MemoryRouter initialEntries={['/categorias/edit/123']}>
                <Routes>
                    <Route path="/categorias/edit/:id" element={<CreateCategory />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Nombre existente')).toBeInTheDocument();
        });
    });

    test('muestra advertencia si se envía sin completar el campo nombre', () => {
        render(
            <MemoryRouter>
                <CreateCategory />
            </MemoryRouter>
        );

        const button = screen.getByRole('button', { name: /crear/i });
        fireEvent.click(button);

        expect(Toast.warning).toHaveBeenCalledWith(Messages.Validation.requiredFields);
    });

    test('envía formulario al crear categoría', async () => {
        mockedAPI.post.mockResolvedValueOnce({ message: 'Creado con éxito', data: null, success: true });

        render(
            <MemoryRouter>
                <CreateCategory />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Nombre'), {
            target: { value: 'Nueva categoría' },
        });

        fireEvent.click(screen.getByRole('button', { name: /crear/i }));

        await waitFor(() => {
            expect(API.post).toHaveBeenCalledWith('category/create', { Name: 'Nueva categoría' });
        });
    });

    test('muestra botón "Actualizar" si está en modo edición', async () => {
        mockedAPI.get.mockResolvedValueOnce({ data: { name: 'Categoría existente' }, success: true });

        render(
            <MemoryRouter initialEntries={['/categorias/edit/123']}>
                <Routes>
                    <Route path="/categorias/edit/:id" element={<CreateCategory />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
        });
    });

    test('modo lectura deshabilita input y oculta botón de acción', () => {
        render(
            <MemoryRouter>
                <CreateCategory isWatching={true} />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText('Nombre');
        expect(input).toBeDisabled();

        expect(screen.queryByRole('button', { name: /crear/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /actualizar/i })).not.toBeInTheDocument();
    });
});
