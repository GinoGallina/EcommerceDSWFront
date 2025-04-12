const URL = import.meta.env.VITE_API_URL;
import Toast from '../components/Toast/Toast';
import { ApiInterfaces, IGenericGetAllResquest } from '../interfaces';
import { DownloadInterface } from '../interfaces/shared/Download';
import { LocalStorage } from './LocalStorage';
import { Messages } from './constants/Messages';

// TODO: ver unknown, crear todos los tipos de datos y pasarlos depsues
interface APIResponse<T = ApiInterfaces> {
    data: T;
    success: boolean;
    message?: string;
    error?: {
        message: string;
        code: number;
    };
}

interface RequestParams {
    [key: string]: string | number | boolean | null;
}

const get = async <T = ApiInterfaces>(path: string, rq: Record<string, string> | IGenericGetAllResquest): Promise<APIResponse<T>> => {
    const params = new URLSearchParams(rq as Record<string, string>);
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

    if (!json.success && json.error?.message) {
        Toast.error(json.error.message);
        throw json;
    }

    return json;
};

const getDifferentUrl = async <T = ApiInterfaces>(url: string, rq: Record<string, string>) => {
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

const post = async <T = ApiInterfaces>(
    path: string,
    rq: FormData | RequestParams | IGenericGetAllResquest | null,
    isFormData = false
): Promise<APIResponse<T>> => {
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

    if (!json.success && json.error?.message) {
        Toast.error(json.error.message);
        throw json;
    }

    return json;
};

const download = async (path: string, rq: Record<string, string>) => {
    const response = await get<DownloadInterface>(path, rq);

    if (!response || !response?.data) {
        Toast.error(Messages.Error.generic);
        return;
    }

    const imageResponse = await fetch(response.data?.signedUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'no-cors',
        },
    });

    if (!imageResponse.ok) {
        if (imageResponse.status === 403) return Toast.error(Messages.Error[403]);
        else if (imageResponse.status === 404) return Toast.error(Messages.Error[404]);
        else if (imageResponse.status >= 500) return Toast.error(Messages.Error[500]);
        else return Toast.error(Messages.Error.generic);
    }

    const imageBlob = await imageResponse.blob();
    const url = URL.createObjectURL(imageBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imagen';
    a.click();
    URL.revokeObjectURL(url);

    return response;
};

const API = {
    get,
    post,
    download,
    getDifferentUrl,
};

export default API;
