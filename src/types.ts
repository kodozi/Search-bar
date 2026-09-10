/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "Development" | "Design" | "Productivity" | "Learning";
  tags: string[];
  clicks: number;
  isCustom?: boolean;
}

export type SortOption = "relevance" | "alphabetical" | "popular";
