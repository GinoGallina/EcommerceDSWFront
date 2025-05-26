import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../screens/public/Login';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../components/Toast/Toast', () => ({
    __esModule: true,
    default: {
        warning: jest.fn(),
    },
}));

jest.mock('../../app/API', () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
    },
}));

const mockLoginResponse = {
    data: {
        token: 'fake-token',
        sessionExpiration: '2099-12-31T23:59:59Z',
        user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            roles: ['user'],
            address: 'Test Street',
        },
    },
};

describe('Login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('muestra Loader en el botón cuando loading es true', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const button = screen.getByRole('button', { name: /acceder/i });

        fireEvent.click(button);
        fireEvent.click(button);

        expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('actualiza el valor del input email y password al escribir', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '123456' } });

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('123456');
    });

    test('muestra advertencia si se envía con campos vacíos', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const button = screen.getByRole('button', { name: /acceder/i });
        fireEvent.click(button);

        expect(Toast.warning).toHaveBeenCalledWith('Por favor, complete todos los campos obligatorios.');
    });

    test('deshabilita el botón cuando loading es true', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const button = screen.getByRole('button', { name: /acceder/i });

        fireEvent.click(button);
        fireEvent.click(button);

        expect(button).toBeDisabled();
    });

    test('llama a API.post cuando el formulario es válido', async () => {
        (API.post as jest.Mock).mockResolvedValue(mockLoginResponse);

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });

        fireEvent.change(screen.getByLabelText(/contraseña/i), {
            target: { value: '123456' },
        });

        fireEvent.click(screen.getByRole('button', { name: /acceder/i }));

        await waitFor(() => {
            expect(API.post).toHaveBeenCalledWith('auth/login', {
                email: 'test@example.com',
                password: '123456',
            });
        });
    });
});
