"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useClients } from "@/src/features/clients";
import { useUpdateOrder } from "../model/useUpdateOrder";
import { orderFormSchema, type OrderFormValues } from "../model/schema";

type EditableOrder = {
  id: string;
  clientId: string;
  date: string;
  itemName: string;
  tonnage: number;
  unitPrice: number;
  memo?: string | null;
};

type Props = {
  order: EditableOrder | null;
  onClose: () => void;
};

function calcTotal(tonnage: number, unitPrice: number): number {
  return Math.round(tonnage * unitPrice * 1.1);
}

function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

export function EditOrderDialog({ order, onClose }: Props) {
  const [dateOpen, setDateOpen] = useState(false);

  const { data } = useClients({});
  const { mutate: updateOrder, isPending } = useUpdateOrder();

  const clients = data?.items ?? [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
  });

  useEffect(() => {
    if (order) {
      reset({
        clientId: order.clientId,
        date: new Date(order.date),
        itemName: order.itemName,
        tonnage: order.tonnage,
        unitPrice: order.unitPrice,
        memo: order.memo ?? "",
      });
    }
  }, [order, reset]);

  const [tonnage, unitPrice] = useWatch({ control, name: ["tonnage", "unitPrice"] });
  const totalAmount =
    tonnage > 0 && unitPrice > 0 ? calcTotal(tonnage, unitPrice) : null;

  function onSubmit(values: OrderFormValues) {
    if (!order) return;
    updateOrder(
      {
        id: order.id,
        body: {
          clientId: values.clientId,
          date: format(values.date, "yyyy-MM-dd"),
          itemName: values.itemName,
          tonnage: values.tonnage,
          unitPrice: values.unitPrice,
          memo: values.memo,
        },
      },
      {
        onSuccess: () => {
          onClose();
          reset();
        },
      }
    );
  }

  function handleClose() {
    onClose();
    reset();
  }

  return (
    <Dialog open={order !== null} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>주문 수정</DialogTitle>
        </DialogHeader>

        <form
          id="edit-order-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4 py-2"
        >
          {/* 거래처 */}
          <div className="flex flex-col gap-1.5">
            <Label>거래처</Label>
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="거래처 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.clientId && (
              <p className="text-destructive text-xs">{errors.clientId.message}</p>
            )}
          </div>

          {/* 주문 날짜 */}
          <div className="flex flex-col gap-1.5">
            <Label>주문 날짜</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="justify-start gap-2 cursor-pointer"
                    >
                      <CalendarIcon className="size-4" />
                      {field.value ? format(field.value, "yyyy-MM-dd") : "날짜 선택"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(d) => {
                        field.onChange(d);
                        setDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && (
              <p className="text-destructive text-xs">{errors.date.message}</p>
            )}
          </div>

          {/* 품목 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-item">품목</Label>
            <Input
              id="edit-item"
              placeholder="품목 입력"
              aria-invalid={!!errors.itemName}
              {...register("itemName")}
            />
            {errors.itemName && (
              <p className="text-destructive text-xs">{errors.itemName.message}</p>
            )}
          </div>

          {/* 톤수 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-tonnage">톤수</Label>
            <Input
              id="edit-tonnage"
              type="number"
              step="0.1"
              placeholder="톤수 입력"
              aria-invalid={!!errors.tonnage}
              {...register("tonnage", { valueAsNumber: true })}
            />
            {errors.tonnage && (
              <p className="text-destructive text-xs">{errors.tonnage.message}</p>
            )}
          </div>

          {/* 단가 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-unit-price">단가</Label>
            <Input
              id="edit-unit-price"
              type="number"
              placeholder="단가 입력"
              aria-invalid={!!errors.unitPrice}
              {...register("unitPrice", { valueAsNumber: true })}
            />
            {errors.unitPrice && (
              <p className="text-destructive text-xs">{errors.unitPrice.message}</p>
            )}
          </div>

          {/* 메모 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-memo">메모</Label>
            <Textarea
              id="edit-memo"
              placeholder="메모 입력"
              {...register("memo")}
            />
          </div>

          {/* 합계 금액 */}
          <div className="flex flex-col gap-1.5">
            <Label>합계 금액 (VAT 10% 포함)</Label>
            <div className="flex h-9 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
              {totalAmount !== null ? formatAmount(totalAmount) : "-"}
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="cursor-pointer"
          >
            취소
          </Button>
          <Button
            type="submit"
            form="edit-order-form"
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? "수정 중..." : "수정"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
