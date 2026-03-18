export const ROUTES = {
  login: '/login',
  dashboard: {
    root: '/dashboard/clients',
    clients: '/dashboard/clients',
    clientDetail: (id: string | number) => `/dashboard/clients/${id}`,
    orders: '/dashboard/orders',
    orderDetail: (id: string | number) => `/dashboard/orders/${id}`,
    payments: '/dashboard/payments',
    ledger: '/dashboard/ledger',
  },
} as const;
