import { VictimCreateForm } from "@/components/admin/VictimCreateForm";

export default function NewVictimPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Victim</h1>
      <VictimCreateForm />
    </div>
  );
}
