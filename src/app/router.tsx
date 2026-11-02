import { createBrowserRouter, Navigate } from 'react-router-dom'
import {
  AppShell,
  NotFoundPage,
  RouteErrorFallback,
} from '@/shared/components'
import { DashboardPage } from '@/features/dashboard'
import { ProductsPage } from '@/features/products'
import { OrdersPage } from '@/features/orders'
import { SettingsPage } from '@/features/settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        element: <Navigate to="/products" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
        errorElement: <RouteErrorFallback />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
        errorElement: <RouteErrorFallback />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
        errorElement: <RouteErrorFallback />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        errorElement: <RouteErrorFallback />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
