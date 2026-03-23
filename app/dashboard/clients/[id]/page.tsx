import { ClientDetailPage } from "@/src/pages/clients/ui";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <ClientDetailPage id={id} />;
}
