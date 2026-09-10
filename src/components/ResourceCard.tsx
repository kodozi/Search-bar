/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MouseEvent } from "react";
import { Resource } from "../types";
import { motion } from "motion/react";
import { Star, ExternalLink, Flame } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
  isFavorite: boolean;
  viewMode: "grid" | "list";
  onToggleFavorite: (id: string) => void;
  onTagClick: (tag: string) => void;
  onOpen: (resource: Resource) => void;
}

export default function ResourceCard({
  resource,
  isFavorite,
  viewMode,
  onToggleFavorite,
  onTagClick,
  onOpen,
}: ResourceCardProps) {
  const getCategoryStyles = (cat: Resource["category"]) => {
    switch (cat) {
      case "Development":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Design":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "Productivity":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Learning":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const handleCardClick = (e: MouseEvent) => {
    // If user clicked standard buttons inside the card, do not trigger overall card open click
    const target = e.target as HTMLElement;
    if (
      target.closest("button") || 
      target.closest("a") || 
      target.tagName.toLowerCase() === "button" ||
      target.tagName.toLowerCase() === "a"
    ) {
      return;
    }
    onOpen(resource);
  };

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        onClick={handleCardClick}
        className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.03)] transition-all cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryStyles(resource.category)}`}>
              {resource.category}
            </span>
            {resource.isCustom && (
              <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.5 rounded border border-slate-200">
                Custom
              </span>
            )}
            {resource.clicks > 100 && (
              <span className="flex items-center gap-0.5 text-[10px] bg-amber-50 text-amber-700 font-medium px-1.5 py-0.5 rounded border border-amber-100">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" /> Hot
              </span>
            )}
            <h3 className="text-base font-bold text-slate-800 truncate group-hover:text-slate-900 group-hover:underline decoration-slate-300">
              {resource.title}
            </h3>
          </div>
          <p className="text-sm text-slate-500 line-clamp-1 mb-2">
            {resource.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {resource.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                className="text-[11px] text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 border border-slate-200/50 px-2 py-0.5 rounded-md transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
          <div className="text-right hidden md:block">
            <p className="text-[11px] text-slate-400 font-medium">Popularity</p>
            <p className="text-xs text-slate-600 font-bold tabular-nums">{resource.clicks} clicks</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleFavorite(resource.id)}
              className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`w-4 h-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              onClick={() => onOpen(resource)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors"
            >
              Visit <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid Layout
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-slate-300 hover:shadow-[0_12px_24px_rgba(15,23,42,0.04)] transition-all cursor-pointer h-full"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryStyles(resource.category)}`}>
            {resource.category}
          </span>
          <div className="flex items-center gap-1">
            {resource.isCustom && (
              <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.5 rounded border border-slate-200">
                Custom
              </span>
            )}
            {resource.clicks > 100 && (
              <span className="flex items-center gap-0.5 text-[10px] bg-amber-50 text-amber-700 font-medium px-1.5 py-0.5 rounded border border-amber-100">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Hot
              </span>
            )}
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-slate-900 group-hover:underline decoration-slate-300 leading-snug">
          {resource.title}
        </h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-3 leading-relaxed">
          {resource.description}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {resource.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(tag);
              }}
              className="text-[11px] text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 border border-slate-200/50 px-2.5 py-0.5 rounded-md transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-auto">
          <span className="text-[11px] text-slate-400 font-medium tabular-nums">
            {resource.clicks} visits
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleFavorite(resource.id)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              onClick={() => onOpen(resource)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors"
            >
              Visit <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
