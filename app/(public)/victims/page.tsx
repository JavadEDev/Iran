import { getVictims } from "@/lib/actions/victims";
import { getServerLanguage } from "@/lib/i18n/server";
import { VictimsPageClient } from "@/components/victims/VictimsPageClient";

const PAGE_SIZE = 20;

export default async function VictimsPage() {
  const lang = await getServerLanguage();
  const initialData = await getVictims(
    {},
    { field: "dateOfDeath", direction: "desc" },
    1,
    PAGE_SIZE
  );

  return (
    <VictimsPageClient
      initialVictims={initialData.items}
      initialTotal={initialData.total}
      initialPageSize={initialData.pageSize}
      lang={lang}
    />
  );
}
