import { ClientDetailPage } from "@/src/pages/client/ui";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  return <ClientDetailPage id={id} />;
}
