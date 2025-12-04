import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export function generateMetadata({ params }: Props): Metadata {
  return { title: `Store ${params.id}` };
}

export default function StoreDetailScreen({ params }: Props) {
  const { id } = params;
  if (!id) return notFound();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="text-[20px] font-semibold text-[var(--color-text)]">Food Court</h1>
      <p className="mt-2 text-[14px] text-[var(--color-text-muted)]">Store detail for ID: {id}</p>
    </div>
  );
}