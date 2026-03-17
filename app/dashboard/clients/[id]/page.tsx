import { ClientDetailPage } from "@/src/pages/clients/ui";

export default function Page({ params }: { params: { id: string } }) {
  return <ClientDetailPage id={params.id} />;
}
