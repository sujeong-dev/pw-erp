export const TX_STATUS = {
  UNPAID:  "입금 전",
  PARTIAL: "부분 입금",
  PAID:    "완납",
  CANCEL:  "취소",
} as const;

export type TxStatus = typeof TX_STATUS[keyof typeof TX_STATUS];

export const statusVariant: Record<TxStatus, "default" | "secondary" | "outline" | "destructive"> = {
  [TX_STATUS.UNPAID]:  "secondary",
  [TX_STATUS.PARTIAL]: "default",
  [TX_STATUS.PAID]:    "outline",
  [TX_STATUS.CANCEL]:  "destructive",
};

export const TX_TYPE = {
  SALES:   "매출",
  PAYMENT: "수금",
} as const;
export type TxType = typeof TX_TYPE[keyof typeof TX_TYPE];

export const CREDIT_TYPE = {
  DEPOSIT: "입금",
  REFUND:  "환불",
} as const;
export type CreditType = typeof CREDIT_TYPE[keyof typeof CREDIT_TYPE];
