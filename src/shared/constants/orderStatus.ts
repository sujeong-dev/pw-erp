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
