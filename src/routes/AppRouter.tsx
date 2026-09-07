// src/routes/AppRouter.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Component as ListingFormPage } from '../features/listings/pages/ListingFormPage';
import { Component as MyListingsPage } from '../features/listings/pages/MyListingsPage';
import { Component as ReviewFormPage } from '../features/reviews/pages/ReviewFormPage';

const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('../layouts/RootLayout'),
    children: [
      { index: true, lazy: () => import('../features/listings/pages/ListingsPage') },
      {
        path: 'listings/new',
        element: (
          <ProtectedRoute>
            <ListingFormPage />
          </ProtectedRoute>
        ),
      },
      { path: 'listings/:id', lazy: () => import('../features/listings/pages/ListingDetailsPage') },
      {
        path: 'listings/:id/edit',
        element: (
          <ProtectedRoute>
            <ListingFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my/listings',
        element: (
          <ProtectedRoute>
            <MyListingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders/:orderId/review',
        element: (
          <ProtectedRoute>
            <ReviewFormPage />
          </ProtectedRoute>
        ),
      },
      { path: 'login', lazy: () => import('../features/auth/pages/LoginPage') },
      { path: 'register', lazy: () => import('../features/auth/pages/RegisterPage') },
      { path: '*', lazy: () => import('../components/common/NotFoundPage') },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
