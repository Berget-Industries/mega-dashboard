import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/index'));
const Analytics = lazy(() => import('src/pages/dashboard/analytics'));
const Settings = lazy(() => import('src/pages/dashboard/settings'));
const Tickets = lazy(() => import('src/pages/dashboard/tickets'));
const TicketsDetails = lazy(() => import('src/pages/dashboard/ticket-details'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'analytics', element: <Analytics /> },
      {
        path: 'settings',
        element: (
          <RoleBasedGuard hasContent>
            <Settings />
          </RoleBasedGuard>
        ),
      },
      {
        path: 'tickets',
        element: <Outlet />,
        children: [
          {
            element: <Tickets />,
            index: true,
          },
          {
            element: <TicketsDetails />,
            path: 'details',
          },
        ],
      },
    ],
  },
];
