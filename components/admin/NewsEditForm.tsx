"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateNews, deleteNews } from "@/lib/actions/news";
import type { NewsDetail } from "@/lib/types";

interface NewsEditFormProps {
  news: NewsDetail;
}

export function NewsEditForm({ news }: NewsEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    slug: news.slug,
    titleFa: news.titleFa || "",
    titleEn: news.titleEn || "",
    publicationDate: news.publicationDate.toISOString().split('T')[0],
    country: news.country,
    cities: news.cities.join(", "),
    excerptSeparatorPosition: news.excerptSeparatorPosition?.toString() || "",
    contentFa: news.contentFa || "",
    contentEn: news.contentEn || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await updateNews(news.slug, {
        slug: formData.slug,
        titleFa: formData.titleFa || undefined,
        titleEn: formData.titleEn || undefined,
        publicationDate: new Date(formData.publicationDate),
        country: formData.country,
        cities: formData.cities.split(",").map((c) => c.trim()).filter(Boolean),
        excerptSeparatorPosition: formData.excerptSeparatorPosition ? parseInt(formData.excerptSeparatorPosition) : undefined,
        contentFa: formData.contentFa || undefined,
        contentEn: formData.contentEn || undefined,
        imageFile: imageFile || undefined,
        videoFile: videoFile || undefined,
        audioFile: audioFile || undefined,
      });

      if (result.success) {
        router.push("/admin/news");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this news article?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteNews(news.slug);
      if (result.success) {
        router.push("/admin/news");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
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

      <div className="grid md:grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium mb-2">Country</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Cities (comma-separated)</label>
        <input
          type="text"
          value={formData.cities}
          onChange={(e) => setFormData({ ...formData, cities: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Excerpt Separator Position (character index)</label>
        <input
          type="number"
          value={formData.excerptSeparatorPosition}
          onChange={(e) => setFormData({ ...formData, excerptSeparatorPosition: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          placeholder="Leave empty for auto-excerpt"
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

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
          {news.media.image && (
            <div className="mt-2">
              <img src={news.media.image} alt="Current image" className="h-32 w-auto rounded" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
          {news.media.video && (
            <div className="mt-2">
              <video src={news.media.video} controls className="h-32 w-auto rounded" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Audio</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
          {news.media.audio && (
            <div className="mt-2">
              <audio src={news.media.audio} controls className="w-full" />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
