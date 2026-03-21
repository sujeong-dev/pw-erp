import { z } from 'zod';

export const orderFormSchema = z.object({
  clientId: z.string().min(1, '거래처를 선택해주세요.'),
  date: z.date({ message: '날짜를 선택해주세요.' }),
  itemName: z.string().min(1, '품목을 입력해주세요.'),
  tonnage: z
    .number({ message: '톤수를 입력해주세요.' })
    .positive('0보다 커야 합니다.'),
  unitPrice: z
    .number({ message: '단가를 입력해주세요.' })
    .int()
    .positive('0보다 커야 합니다.'),
  memo: z.string().optional(),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
