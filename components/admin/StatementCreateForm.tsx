"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createStatement } from "@/lib/actions/statements";

const defaultDate = new Date().toISOString().split("T")[0];

export function StatementCreateForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    titleFa: "",
    titleEn: "",
    publicationDate: defaultDate,
    contentFa: "",
    contentEn: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const result = await createStatement({
        slug: formData.slug,
        titleFa: formData.titleFa || undefined,
        titleEn: formData.titleEn || undefined,
        publicationDate: new Date(formData.publicationDate),
        contentFa: formData.contentFa || undefined,
        contentEn: formData.contentEn || undefined,
        imageFile: imageFile || undefined,
      });

      if (result.success) {
        toast.success("Statement created successfully!");
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push("/admin/statements");
      } else {
        const errorMsg = result.error || "Failed to create statement";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsPending(false);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-2">Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title (Persian)</label>
          <input
            type="text"
            value={formData.titleFa}
            onChange={(e) => setFormData({ ...formData, titleFa: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Title (English)</label>
          <input
            type="text"
            value={formData.titleEn}
            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Publication Date</label>
        <input
          type="date"
          value={formData.publicationDate}
          onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content (Persian)</label>
        <textarea
          value={formData.contentFa}
          onChange={(e) => setFormData({ ...formData, contentFa: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          rows={10}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content (English)</label>
        <textarea
          value={formData.contentEn}
          onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          rows={10}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Statement"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/statements")}
          disabled={isPending}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
