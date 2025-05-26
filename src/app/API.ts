// const URL = 'http://localhost:7777/api';
const URL = import.meta.env.VITE_API_URL;
import Toast from '../components/Toast/Toast';
import { IGenericGetAllResquest } from '../interfaces';
import { LocalStorage } from './LocalStorage';
import { Messages } from './constants/Messages';

interface APIResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    error?: {
        message: string;
        code: number;
    };
}

const get = async <T>(
    path: string,
    rq: Record<string, string | number | boolean | Array<string | number | boolean>> | IGenericGetAllResquest
): Promise<APIResponse<T>> => {
    const params = new URLSearchParams();

    Object.entries(rq).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, String(v)));
        } else {
            params.append(key, String(value));
        }
    });

    const response = await fetch(`${URL}/${path}?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'no-cors',
            Authorization: `Bearer ${LocalStorage.getToken()}`,
        },
    });

    let json: APIResponse<T> | null = null;

    try {
        json = await response.json();
    } catch (err) {
        if (!response.ok) {
            if (response.status === 403) Toast.error(Messages.Error[403]);
            else if (response.status === 404) Toast.error(Messages.Error[404]);
            else if (response.status === 401) Toast.error(Messages.Error[401]);
            else if (response.status >= 500) Toast.error(Messages.Error[500]);
            else Toast.error(Messages.Error.generic);
        } else {
            Toast.error('Error inesperado al procesar la respuesta.');
        }
        throw err;
    }

    if (!json) throw json;

    if (!json.success && (json.error?.message || json.message)) {
        Toast.error(json.error?.message || json.message || '');
        throw json;
    }

    return json;
};

const getDifferentUrl = async <T>(url: string, rq: Record<string, string>) => {
    const params = new URLSearchParams(rq);
    const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'no-cors',
        },
    });

    if (!response.ok) {
        if (response.status === 403) return Toast.error(Messages.Error[403]);
        else if (response.status === 404) return Toast.error(Messages.Error[404]);
        else if (response.status >= 500) return Toast.error(Messages.Error[500]);
        else return Toast.error(Messages.Error.generic);
    }

    const json: APIResponse<T> = await response.json();

    return json;
};

const post = async <TResponse, TRequest>(path: string, rq: TRequest, isFormData = false): Promise<APIResponse<TResponse>> => {
    const headers: HeadersInit = isFormData
        ? {}
        : {
              'Content-Type': 'application/json',
          };

    const response = await fetch(`${URL}/${path}`, {
        method: 'POST',
        headers: {
            ...headers,
            'Access-Control-Allow-Origin': 'no-cors',
            Authorization: `Bearer ${LocalStorage.getToken()}`,
        },
        body: isFormData ? (rq as FormData) : JSON.stringify(rq),
    });

    let json: APIResponse<TResponse> | null = null;

    try {
        json = await response.json();
    } catch (err) {
        if (!response.ok) {
            if (response.status === 403) Toast.error(Messages.Error[403]);
            else if (response.status === 404) Toast.error(Messages.Error[404]);
            else if (response.status === 401) Toast.error(Messages.Error[401]);
            else if (response.status >= 500) Toast.error(Messages.Error[500]);
            else Toast.error(Messages.Error.generic);
        } else {
            Toast.error('Error inesperado al procesar la respuesta.');
        }
        throw err;
    }

    if (!json) throw json;

    if (!json.success && (json.error?.message || json.message)) {
        Toast.error(json.error?.message || json.message || '');
        throw json;
    }

    return json;
};

const API = {
    get,
    post,
    getDifferentUrl,
};

export default API;
