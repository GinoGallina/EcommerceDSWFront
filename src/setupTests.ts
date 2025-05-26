import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(globalThis, { TextEncoder, TextDecoder });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).importMetaEnv = {
    VITE_API_URL: 'http://localhost:3000',
};
