"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createVictim } from "@/lib/actions/victims";
import type { Gender } from "@/lib/types";
import { validateFileSize } from "@/lib/utils/validation";

const defaultDate = new Date().toISOString().split("T")[0];

export function VictimCreateForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    fullNameFa: "",
    fullNameEn: "",
    age: "",
    gender: "unknown" as Gender,
    city: "",
    cityEn: "",
    dateOfDeath: defaultDate,
    notesFa: "",
    notesEn: "",
    source: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (photoFile) {
      const fileCheck = validateFileSize(photoFile, 2);
      if (!fileCheck.valid) {
        setError(fileCheck.error ?? "Photo must be 2MB or less");
        return;
      }
    }

    setIsPending(true);
    try {
      const result = await createVictim({
        fullNameFa: formData.fullNameFa || undefined,
        fullNameEn: formData.fullNameEn || undefined,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        gender: formData.gender,
        city: formData.city,
        cityEn: formData.cityEn || undefined,
        dateOfDeath: new Date(formData.dateOfDeath),
        notesFa: formData.notesFa || undefined,
        notesEn: formData.notesEn || undefined,
        source: formData.source || undefined,
        photoFile: photoFile || undefined,
      });

      if (result.success) {
        toast.success("Victim created successfully!");
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push("/admin/victims");
      } else {
        const errorMsg = result.error || "Failed to create victim";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsPending(false);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Name (Persian)
          </label>
          <input
            type="text"
            value={formData.fullNameFa}
            onChange={(e) =>
              setFormData({ ...formData, fullNameFa: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Name (English)
          </label>
          <input
            type="text"
            value={formData.fullNameEn}
            onChange={(e) =>
              setFormData({ ...formData, fullNameEn: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value as Gender })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="child">Child</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            City (Persian)
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            City (English)
          </label>
          <input
            type="text"
            value={formData.cityEn}
            onChange={(e) =>
              setFormData({ ...formData, cityEn: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Date of Death
          </label>
          <input
            type="date"
            value={formData.dateOfDeath}
            onChange={(e) =>
              setFormData({ ...formData, dateOfDeath: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Notes (Persian)
        </label>
        <textarea
          value={formData.notesFa}
          onChange={(e) =>
            setFormData({ ...formData, notesFa: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Notes (English)
        </label>
        <textarea
          value={formData.notesEn}
          onChange={(e) =>
            setFormData({ ...formData, notesEn: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Source links (Telegram, X, Instagram, others)
        </label>
        <textarea
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          rows={3}
          placeholder="Paste one or more URLs (each on a new line or separated by commas)"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Optional: links to posts or articles about this victim (e.g. Telegram,
          X.com, Instagram).
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Victim"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/victims")}
          disabled={isPending}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
