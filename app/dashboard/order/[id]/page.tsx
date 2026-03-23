import { OrderDetailPage } from "@/src/pages/order/ui";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  return <OrderDetailPage id={id} />;
}
