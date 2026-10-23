import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell, NotFoundPage } from '@/shared/components'
import { DashboardPage } from '@/features/dashboard'
import { ProductsPage } from '@/features/products'
import { OrdersPage } from '@/features/orders'
import { SettingsPage } from '@/features/settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/products" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
