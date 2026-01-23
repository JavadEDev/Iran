import { getVictims } from "@/lib/actions/victims";
import { getServerLanguage } from "@/lib/i18n/server";
import { VictimsPageClient } from "@/components/victims/VictimsPageClient";

export default async function VictimsPage() {
  const lang = await getServerLanguage();
  const initialData = await getVictims({}, { field: "dateOfDeath", direction: "desc" }, 1, 100);

  return <VictimsPageClient initialVictims={initialData.items} lang={lang} />;
}
