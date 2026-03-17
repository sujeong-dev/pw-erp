export default function ClientDetailPage({ params }: { params: { id: string } }) {
  return <div className="p-8">거래처 상세: {params.id}</div>;
}
