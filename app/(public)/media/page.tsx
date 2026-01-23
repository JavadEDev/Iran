import { getMediaList } from "@/lib/actions/media";
import { getServerLanguage } from "@/lib/i18n/server";
import { MediaPageClient } from "@/components/media/MediaPageClient";

export default async function MediaPage() {
  const lang = await getServerLanguage();
  const initialData = await getMediaList({}, { field: "createdAt", direction: "desc" }, 1, 50);

  return <MediaPageClient initialMedia={initialData.items} lang={lang} />;
}
