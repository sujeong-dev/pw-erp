export const ROUTES = {
  login: '/login',
  dashboard: {
    root: '/dashboard/client',
    clients: '/dashboard/client',
    clientDetail: (id: string | number) => `/dashboard/client/${id}`,
    orders: '/dashboard/order',
    orderDetail: (id: string | number) => `/dashboard/order/${id}`,
    payments: '/dashboard/payment',
    paymentDetail: (id: string | number) => `/dashboard/payment/${id}`,
    ledger: '/dashboard/ledger',
  },
} as const;
