// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    analytics: `${ROOTS.DASHBOARD}/analytics`,
    tickets: {
      root: `${ROOTS.DASHBOARD}/tickets`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tickets/details?id=${id}`,
    },
    settings: `${ROOTS.DASHBOARD}/settings`,
    apiKeys: `${ROOTS.DASHBOARD}/api-keys`,
    sendMail: `${ROOTS.DASHBOARD}/send-mail`,
    // ADMIN
    admin: {
      organizations: `${ROOTS.DASHBOARD}/admin/organizations`,
      users: `${ROOTS.DASHBOARD}/admin/users`,
      systemAPIKeys: `${ROOTS.DASHBOARD}/admin/systemAPIKeys`,
    },
  },
};
