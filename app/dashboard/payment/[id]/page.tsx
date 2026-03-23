import { PaymentDetailPage } from "@/src/pages/payment/ui";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  return <PaymentDetailPage id={id} />;
}
