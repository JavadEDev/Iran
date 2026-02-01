import { StatementCreateForm } from "@/components/admin/StatementCreateForm";

export default function NewStatementPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Statement</h1>
      <StatementCreateForm />
    </div>
  );
}
