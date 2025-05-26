import { Roles } from '../../app/constants/Roles';
import { formatCurrency, formatRole, Dates } from '../../app/Helpers';

describe('formatCurrency', () => {
    it('formats a positive number', () => {
        expect(formatCurrency(1234.56)).toBe('$1.234,56');
    });

    it('formats a negative number', () => {
        expect(formatCurrency(-1234.56)).toBe('-$1.234,56');
    });

    it('formats a numeric string', () => {
        expect(formatCurrency('789')).toBe('$789');
    });

    it('formats 0', () => {
        expect(formatCurrency(0)).toBe('$0,00');
    });
});

describe('formatRole', () => {
    it('formats known roles', () => {
        expect(formatRole(Roles.Admin)).toBe('Administrador');
        expect(formatRole(Roles.Seller)).toBe('Vendedor');
        expect(formatRole(Roles.User)).toBe('Usuario');
    });

    it('returns "Sin rol" for unknown role', () => {
        expect(formatRole('something')).toBe('Sin rol');
    });
});

describe('Dates utils', () => {
    it('formats a valid date string to ISO with 00:00:00Z', () => {
        const input = '2024-05-08';
        const result = Dates.formatDate(input);
        expect(result).toBe('2024-05-08T00:00:00Z');
    });
});
