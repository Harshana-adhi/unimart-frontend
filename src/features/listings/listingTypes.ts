// src/features/listings/listingTypes.ts
export type ListingStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'ARCHIVED';

export interface Listing {
  id: number;
  sellerId: number;
  sellerName: string;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  price: number;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ListingInput {
  title: string;
  description: string;
  price: number;
  categoryId: number;
}

export interface ListingQuery {
  q?: string;
  categoryId?: number;
  status?: ListingStatus;
  sellerId?: number;
  page?: number;
  size?: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Page<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
