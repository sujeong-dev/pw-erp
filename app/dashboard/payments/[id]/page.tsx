import { PaymentDetailPage } from "@/src/pages/payments/ui";

export default function Page({ params }: { params: { id: string } }) {
  return <PaymentDetailPage id={params.id} />;
}
