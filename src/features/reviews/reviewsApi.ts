// src/features/reviews/reviewsApi.ts
import { baseApi } from '../../services/baseApi';
import type { Page } from '../listings/listingTypes';
import type { Review, ReviewCreateInput, ReviewUpdateInput } from './reviewTypes';

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getListingReviews: build.query<Page<Review>, { listingId: number; page?: number }>({
      query: ({ listingId, page = 0 }) => ({
        url: `listings/${listingId}/reviews`,
        params: { page, size: 10 },
      }),
      providesTags: (_r, _e, { listingId }) => [{ type: 'Review', id: `LISTING-${listingId}` }],
    }),
    createReview: build.mutation<Review, ReviewCreateInput>({
      query: (body) => ({ url: 'reviews', method: 'POST', body }),
      // Broad invalidation — RTK Query treats invalidating the bare 'Review'
      // type as matching every id under it, including any LISTING-{id} tag,
      // so this refreshes the right listing's review list without needing
      // to know which listing the order belonged to on the client.
      invalidatesTags: ['Review'],
    }),
    updateReview: build.mutation<Review, { id: number; body: ReviewUpdateInput }>({
      query: ({ id, body }) => ({ url: `reviews/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Review'],
    }),
    deleteReview: build.mutation<void, number>({
      query: (id) => ({ url: `reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useGetListingReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;
