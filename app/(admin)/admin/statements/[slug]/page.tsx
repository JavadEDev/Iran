import { getStatementBySlug } from "@/lib/actions/statements";
import { getServerLanguage } from "@/lib/i18n/server";
import { notFound } from "next/navigation";
import { StatementEditForm } from "@/components/admin/StatementEditForm";

export default async function StatementEditPage({
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Statement</h1>
      <StatementEditForm statement={statement} />
    </div>
  );
}
