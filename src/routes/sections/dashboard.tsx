import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import path from 'path';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/index'));
const Analytics = lazy(() => import('src/pages/dashboard/analytics'));
const Settings = lazy(() => import('src/pages/dashboard/settings'));
const APIKeys = lazy(() => import('src/pages/dashboard/api-keys'));
const SystemAPIKeys = lazy(() => import('src/pages/dashboard/admin/systemAPIKeys'));
const Organizations = lazy(() => import('src/pages/dashboard/admin/organizations'));
const Users = lazy(() => import('src/pages/dashboard/admin/users'));
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
        element: (
          <RoleBasedGuard>
            <Settings />
          </RoleBasedGuard>
        ),
        path: 'settings',
      },
      {
        element: (
          <RoleBasedGuard>
            <APIKeys />
          </RoleBasedGuard>
        ),
        path: 'api-keys',
      },
      {
        path: 'admin',
        element: (
          <RoleBasedGuard>
            <Outlet />
          </RoleBasedGuard>
        ),
        children: [
          {
            element: <Organizations />,
            path: 'organizations',
          },
          {
            element: <Users />,
            path: 'users',
          },
          {
            element: <SystemAPIKeys />,
            path: 'systemAPIKeys',
          },
        ],
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
