"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createMedia } from "@/lib/actions/media";
import type { MediaType } from "@/lib/types";

export function MediaCreateForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    mediaType: "photo" as MediaType,
    country: "",
    city: "",
    district: "",
    eventDate: "",
    descriptionFa: "",
    descriptionEn: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Media file is required");
      return;
    }

    setIsPending(true);
    try {
      const result = await createMedia({
        mediaType: formData.mediaType,
        country: formData.country,
        city: formData.city,
        district: formData.district || undefined,
        eventDate: formData.eventDate ? new Date(formData.eventDate) : undefined,
        descriptionFa: formData.descriptionFa || undefined,
        descriptionEn: formData.descriptionEn || undefined,
        file,
      });

      if (result.success) {
        toast.success("Media item created successfully!");
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push("/admin/media");
      } else {
        const errorMsg = result.error || "Failed to create media";
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
        <label className="block text-sm font-medium mb-2">Media Type</label>
        <select
          value={formData.mediaType}
          onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as MediaType })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          required
        >
          <option value="photo">Photo</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
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
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">District/Neighborhood</label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Event Date</label>
          <input
            type="date"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description (Persian)</label>
        <textarea
          value={formData.descriptionFa}
          onChange={(e) => setFormData({ ...formData, descriptionFa: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description (English)</label>
        <textarea
          value={formData.descriptionEn}
          onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Media File (required)</label>
        <input
          type="file"
          accept={formData.mediaType === "photo" ? "image/*" : "video/*"}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          required
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Media"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/media")}
          disabled={isPending}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
