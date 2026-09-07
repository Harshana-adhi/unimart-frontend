// src/features/auth/authApi.ts
import { baseApi } from '../../services/baseApi';
import type { LoginRequest, RegisterRequest, TokenResponse } from './authType';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<TokenResponse, LoginRequest>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
    }),
    register: build.mutation<void, RegisterRequest>({
      query: (body) => ({ url: 'auth/register', method: 'POST', body }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
