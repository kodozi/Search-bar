/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Resource } from "../types";
import { Database, BookmarkCheck, BarChart3, Star } from "lucide-react";

interface StatsBannerProps {
  resources: Resource[];
  favoriteCount: number;
}

export default function StatsBanner({ resources, favoriteCount }: StatsBannerProps) {
  const totalCount = resources.length;
  const customCount = resources.filter(r => r.isCustom).length;
  const totalClicks = resources.reduce((sum, r) => sum + r.clicks, 0);

  const stats = [
    {
      label: "Total Directory Links",
      value: totalCount,
      icon: Database,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Your Custom Bookmarks",
      value: customCount,
      icon: BookmarkCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Accumulated Visits",
      value: totalClicks,
      icon: BarChart3,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label: "Pinned Favorites",
      value: favoriteCount,
      icon: Star,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-white border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-slate-300/80 transition-colors"
          >
            <div className={`p-2 rounded-lg border ${stat.color} flex-shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium truncate">{stat.label}</p>
              <p className="text-base md:text-lg font-bold text-slate-800 tabular-nums">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
