import { getStatementBySlug } from "@/lib/actions/statements";
import { getServerLanguage } from "@/lib/i18n/server";
import { StatementDetail } from "@/components/statements/StatementDetail";
import { notFound } from "next/navigation";

export default async function StatementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lang = await getServerLanguage();
  const statement = await getStatementBySlug(slug, lang);

  if (!statement) {
    notFound();
  }

  return <StatementDetail statement={statement} />;
}
