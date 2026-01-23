"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateVictim, deleteVictim } from "@/lib/actions/victims";
import type { Victim, Gender } from "@/lib/types";

interface VictimEditFormProps {
  victim: Victim;
}

export function VictimEditForm({ victim }: VictimEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    fullNameFa: victim.fullNameFa || "",
    fullNameEn: victim.fullNameEn || "",
    age: victim.age?.toString() || "",
    gender: victim.gender,
    city: victim.city,
    dateOfDeath: victim.dateOfDeath.toISOString().split('T')[0],
    notesFa: victim.notesFa || "",
    notesEn: victim.notesEn || "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await updateVictim(victim.id, {
        fullNameFa: formData.fullNameFa || undefined,
        fullNameEn: formData.fullNameEn || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender,
        city: formData.city,
        dateOfDeath: new Date(formData.dateOfDeath),
        notesFa: formData.notesFa || undefined,
        notesEn: formData.notesEn || undefined,
        photoFile: photoFile || undefined,
      });

      if (result.success) {
        router.push("/admin/victims");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this victim?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteVictim(victim.id);
      if (result.success) {
        router.push("/admin/victims");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name (Persian)</label>
          <input
            type="text"
            value={formData.fullNameFa}
            onChange={(e) => setFormData({ ...formData, fullNameFa: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Name (English)</label>
          <input
            type="text"
            value={formData.fullNameEn}
            onChange={(e) => setFormData({ ...formData, fullNameEn: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
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
          <label className="block text-sm font-medium mb-2">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date of Death</label>
          <input
            type="date"
            value={formData.dateOfDeath}
            onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })}
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
        {victim.photoUrl && (
          <div className="mt-2">
            <img src={victim.photoUrl} alt="Current photo" className="h-32 w-auto rounded" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes (Persian)</label>
        <textarea
          value={formData.notesFa}
          onChange={(e) => setFormData({ ...formData, notesFa: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes (English)</label>
        <textarea
          value={formData.notesEn}
          onChange={(e) => setFormData({ ...formData, notesEn: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          rows={3}
        />
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
