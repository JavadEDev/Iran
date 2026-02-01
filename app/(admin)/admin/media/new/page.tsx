import { MediaCreateForm } from "@/components/admin/MediaCreateForm";

export default function NewMediaPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Media</h1>
      <MediaCreateForm />
    </div>
  );
}
