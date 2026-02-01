import { getServerLanguage } from "@/lib/i18n/server";
import { PublicLayoutClient } from "@/components/layout/PublicLayoutClient";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLanguage = await getServerLanguage();

  return <PublicLayoutClient initialLanguage={initialLanguage}>{children}</PublicLayoutClient>;
}
