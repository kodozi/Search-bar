/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { Resource } from "../types";
import { CATEGORIES } from "../data";
import { Plus, X, Globe, Link2, Tag, BookOpen } from "lucide-react";

interface AddResourceFormProps {
  onAdd: (resource: Omit<Resource, "id" | "clicks">) => void;
  onClose: () => void;
  prepopulatedTitle?: string;
}

export default function AddResourceForm({ onAdd, onClose, prepopulatedTitle = "" }: AddResourceFormProps) {
  const [title, setTitle] = useState(prepopulatedTitle);
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<Resource["category"]>("Development");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!url.trim()) {
      newErrors.url = "URL is required";
    } else {
      try {
        const testUrl = url.trim().startsWith("http://") || url.trim().startsWith("https://") 
          ? url.trim() 
          : `https://${url.trim()}`;
        new URL(testUrl);
      } catch {
        newErrors.url = "Please enter a valid website URL";
      }
    }

    if (!description.trim()) {
      newErrors.description = "Brief description is required";
    } else if (description.trim().length < 10) {
      newErrors.description = "Description should be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = `https://${finalUrl}`;
    }

    // Parse comma separated tags
    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    // Default tag if none provided
    if (parsedTags.length === 0) {
      parsedTags.push(category.toLowerCase());
    }

    onAdd({
      title: title.trim(),
      url: finalUrl,
      category,
      description: description.trim(),
      tags: (Array.from(new Set(parsedTags)) as string[]).slice(0, 5), // Limit to 5 unique tags
      isCustom: true,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 md:p-8 max-w-lg w-full relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Add Custom Bookmark
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Create a personalized bookmark resource. It will be immediately searchable and filterable.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            RESOURCE TITLE
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. My Favorite Dev Blog"
            className={`w-full text-sm px-3.5 py-2.5 rounded-lg border bg-slate-50/50 outline-none focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all ${
              errors.title ? "border-rose-400 bg-rose-50/10 focus:ring-rose-400 focus:border-rose-400" : "border-slate-200"
            }`}
          />
          {errors.title && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>
          )}
        </div>

        {/* URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            WEBSITE URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Link2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. blog.example.com"
              className={`w-full text-sm pl-9 pr-3.5 py-2.5 rounded-lg border bg-slate-50/50 outline-none focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all ${
                errors.url ? "border-rose-400 bg-rose-50/10 focus:ring-rose-400 focus:border-rose-400" : "border-slate-200"
              }`}
            />
          </div>
          {errors.url && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.url}</p>
          )}
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            CATEGORY
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  category === cat
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            DESCRIPTION
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short and clear summary explaining what this resource is used for."
            rows={3}
            className={`w-full text-sm px-3.5 py-2.5 rounded-lg border bg-slate-50/50 outline-none resize-none focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all ${
              errors.description ? "border-rose-400 bg-rose-50/10 focus:ring-rose-400 focus:border-rose-400" : "border-slate-200"
            }`}
          />
          {errors.description && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.description}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            TAGS (COMMA SEPARATED)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. blog, coding, tutorial, resource"
              className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Separate tags using commas. Maximum of 5 tags.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Save Resource
          </button>
        </div>
      </form>
    </div>
  );
}
