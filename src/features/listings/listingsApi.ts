// src/features/listings/listingsApi.ts
import { baseApi } from '../../services/baseApi';
import type { Category, Listing, ListingInput, ListingQuery, Page } from './listingTypes';

export const listingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getListings: build.query<Page<Listing>, ListingQuery>({
      query: (params) => ({ url: 'listings', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Listing' as const, id })),
              { type: 'Listing' as const, id: 'LIST' },
            ]
          : [{ type: 'Listing' as const, id: 'LIST' }],
    }),
    getListing: build.query<Listing, number>({
      query: (id) => `listings/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Listing', id }],
    }),
    createListing: build.mutation<Listing, ListingInput>({
      query: (body) => ({ url: 'listings', method: 'POST', body }),
      invalidatesTags: [{ type: 'Listing', id: 'LIST' }],
    }),
    updateListing: build.mutation<Listing, { id: number; body: ListingInput }>({
      query: ({ id, body }) => ({ url: `listings/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Listing', id },
        { type: 'Listing', id: 'LIST' },
      ],
    }),
    archiveListing: build.mutation<void, number>({
      query: (id) => ({ url: `listings/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Listing', id },
        { type: 'Listing', id: 'LIST' },
      ],
    }),
    getCategories: build.query<Category[], void>({
      query: () => 'categories',
    }),
  }),
});

export const {
  useGetListingsQuery,
  useGetListingQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useArchiveListingMutation,
  useGetCategoriesQuery,
} = listingsApi;
