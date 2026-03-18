import { OrderDetailPage } from "@/src/pages/orders/ui";

export default function Page({ params }: { params: { id: string } }) {
  return <OrderDetailPage id={params.id} />;
}
