import api from './api';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { getCookie } from './helper';

export interface Response<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  rawError?: unknown;
}

export async function Request<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  body?: object | FormData | string,
  customHeaders: Record<string, string> = {}
): Promise<Response<T>> {
  try {
    const isFormData = body instanceof FormData;
    const token = getCookie('appToken');
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
      // 'ngrok-skip-browser-warning': 'true',
    };

    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      headers,
      ...(method === 'GET'
        ? { params: body }
        : isFormData
          ? { data: body }
          : { data: body ? JSON.stringify(body) : undefined }),
    };

    const response = await api.request<T>(config);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    let statusCode: number | undefined;
    let rawError: unknown;
    let message = 'An unknown error occurred';

    if (isAxiosError(error)) {
      statusCode = error.response?.status;
      rawError = error.response?.data;

      message =
        typeof rawError === 'string'
          ? rawError
          : (rawError as Record<string, string>)?.message ||
            error.message ||
            message;
    }

    return {
      success: false,
      error: message,
      statusCode,
      rawError,
    };
  }
}

// Utility type guard
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError)?.isAxiosError === true;
}
