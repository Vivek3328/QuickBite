import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { GuestRoute } from "@/app/GuestRoute";
import { ProtectedUserRoute } from "@/app/ProtectedUserRoute";
import { ProtectedOwnerRoute } from "@/app/ProtectedOwnerRoute";
import { ROUTES } from "@/constants/routes";

import HomePage from "@/features/home/HomePage";
import LoginPage from "@/features/auth/LoginPage";
import AddRestaurantPage from "@/features/auth/AddRestaurantPage";
import RestaurantMenuPage from "@/features/menu/RestaurantMenuPage";
import OwnerMenuPage from "@/features/owner/OwnerMenuPage";
import CartPage from "@/features/cart/CartPage";
import UserOrdersPage from "@/features/orders/UserOrdersPage";
import RestaurantOrdersPage from "@/features/orders/RestaurantOrdersPage";
import OrderSuccessPage from "@/features/orders/OrderSuccessPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      {
        path: "/restaurant/:id",
        element: (
          <ProtectedUserRoute>
            <RestaurantMenuPage />
          </ProtectedUserRoute>
        ),
      },
      {
        path: ROUTES.restaurantMenu,
        element: (
          <ProtectedOwnerRoute>
            <OwnerMenuPage />
          </ProtectedOwnerRoute>
        ),
      },
      {
        path: ROUTES.cart,
        element: (
          <ProtectedUserRoute>
            <CartPage />
          </ProtectedUserRoute>
        ),
      },
      {
        path: ROUTES.userOrders,
        element: (
          <ProtectedUserRoute>
            <UserOrdersPage />
          </ProtectedUserRoute>
        ),
      },
      {
        path: ROUTES.restaurantOrders,
        element: (
          <ProtectedOwnerRoute>
            <RestaurantOrdersPage />
          </ProtectedOwnerRoute>
        ),
      },
      { path: ROUTES.paymentSuccess, element: <OrderSuccessPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.login,
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: ROUTES.addRestaurant,
        element: (
          <GuestRoute>
            <AddRestaurantPage />
          </GuestRoute>
        ),
      },
    ],
  },
  { path: "/Payment-success", element: <Navigate to={ROUTES.paymentSuccess} replace /> },
  { path: "/Restaurant-orders", element: <Navigate to={ROUTES.restaurantOrders} replace /> },
]);
