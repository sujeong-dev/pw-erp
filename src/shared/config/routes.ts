export const ROUTES = {
  login: "/login",
  dashboard: {
    root: "/dashboard",
    clients: "/dashboard/clients",
    clientDetail: (id: string | number) => `/dashboard/clients/${id}`,
    orders: "/dashboard/orders",
    payments: "/dashboard/payments",
    ledger: "/dashboard/ledger",
  },
} as const;
