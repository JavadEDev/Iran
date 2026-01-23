import { getStatementsList } from "@/lib/actions/statements";
import { getServerLanguage } from "@/lib/i18n/server";
import { StatementCard } from "@/components/statements/StatementCard";

export default async function StatementsPage() {
  const lang = await getServerLanguage();
  const statements = await getStatementsList(lang);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Official Statements</h1>
      {statements.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No statements available.</p>
      ) : (
        <div className="space-y-6">
          {statements.map((stmt) => (
            <StatementCard key={stmt.id} statement={stmt} />
          ))}
        </div>
      )}
    </div>
  );
}
