// src/utils/apiError.ts
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { SerializedError } from '@reduxjs/toolkit';

type AnyApiError = FetchBaseQueryError | SerializedError | undefined;

interface ApiErrorBody {
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}

export function getErrorStatus(error: AnyApiError): number | string | undefined {
  if (error && 'status' in error) return error.status;
  return undefined;
}

export function getErrorMessage(error: AnyApiError): string {
  if (!error) return 'Unknown error';
  if ('status' in error) {
    if (error.status === 'FETCH_ERROR') {
      return 'Network error — check your connection and try again.';
    }
    const data = error.data as ApiErrorBody | undefined;
    if (data?.message) return data.message;
    if (typeof error.status === 'number') {
      switch (error.status) {
        case 401:
          return 'Your session has expired. Please log in again.';
        case 403:
          return 'You do not have permission to do that.';
        case 404:
          return 'Not found.';
        case 409:
          return 'This conflicts with existing data.';
        default:
          return `Request failed (${error.status}).`;
      }
    }
    return 'Request failed.';
  }
  return error.message ?? 'Unknown error';
}

export function getFieldErrors(error: AnyApiError): Record<string, string> {
  if (error && 'status' in error) {
    const data = error.data as ApiErrorBody | undefined;
    return data?.fieldErrors ?? {};
  }
  return {};
}
