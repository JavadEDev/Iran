import { NewsCreateForm } from "@/components/admin/NewsCreateForm";

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New News</h1>
      <NewsCreateForm />
    </div>
  );
}
