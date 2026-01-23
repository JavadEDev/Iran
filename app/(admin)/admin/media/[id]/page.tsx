import { getMediaList } from "@/lib/actions/media";
import { notFound } from "next/navigation";
import { MediaEditForm } from "@/components/admin/MediaEditForm";

export default async function MediaEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { items } = await getMediaList({}, { field: "createdAt", direction: "desc" }, 1, 1000);
  const mediaItem = items.find((m) => m.id === id);

  if (!mediaItem) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Media</h1>
      <MediaEditForm media={mediaItem} />
    </div>
  );
}
