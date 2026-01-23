import { getVictims } from "@/lib/actions/victims";
import { notFound } from "next/navigation";
import { VictimEditForm } from "@/components/admin/VictimEditForm";

export default async function VictimEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { items } = await getVictims({}, { field: "createdAt", direction: "desc" }, 1, 1000);
  const victim = items.find((v) => v.id === id);

  if (!victim) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Victim</h1>
      <VictimEditForm victim={victim} />
    </div>
  );
}
