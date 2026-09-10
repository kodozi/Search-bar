/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { Resource, SortOption } from "./types";
import { DEFAULT_RESOURCES, CATEGORIES } from "./data";
import StatsBanner from "./components/StatsBanner";
import ResourceCard from "./components/ResourceCard";
import AddResourceForm from "./components/AddResourceForm";
import { 
  Search, 
  X, 
  Sparkles, 
  Grid, 
  List, 
  BookMarked, 
  Plus, 
  ChevronDown, 
  RotateCcw,
  Check,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Storage states
  const [resources, setResources] = useState<Resource[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [toast, setToast] = useState<{ text: string; type: "success" | "info" | "error" } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedResources = localStorage.getItem("search_portal_resources");
      if (storedResources) {
        setResources(JSON.parse(storedResources));
      } else {
        setResources(DEFAULT_RESOURCES);
        localStorage.setItem("search_portal_resources", JSON.stringify(DEFAULT_RESOURCES));
      }

      const storedFavs = localStorage.getItem("search_portal_favorites");
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }

      const storedSearches = localStorage.getItem("search_portal_recent_searches");
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (e) {
      console.error("Error loading localStorage config:", e);
      // Fallback
      setResources(DEFAULT_RESOURCES);
    }
  }, []);

  // Sync to LocalStorage when states change
  const saveResources = (updated: Resource[]) => {
    setResources(updated);
    localStorage.setItem("search_portal_resources", JSON.stringify(updated));
  };

  const saveFavorites = (updated: string[]) => {
    setFavorites(updated);
    localStorage.setItem("search_portal_favorites", JSON.stringify(updated));
  };

  const saveRecentSearches = (updated: string[]) => {
    setRecentSearches(updated);
    localStorage.setItem("search_portal_recent_searches", JSON.stringify(updated));
  };

  // Keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        showToast("Press Escape to exit search focus", "info");
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Toast manager
  const showToast = (text: string, type: "success" | "info" | "error" = "success") => {
    setToast({ text, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Click tracker
  const handleOpenResource = (res: Resource) => {
    const updated = resources.map((r) => 
      r.id === res.id ? { ...r, clicks: r.clicks + 1 } : r
    );
    saveResources(updated);
  };

  // Favorite toggle
  const handleToggleFavorite = (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((fId) => fId !== id);
      showToast("Removed from your saved list", "info");
    } else {
      updated = [...favorites, id];
      showToast("Added to your saved list!", "success");
    }
    saveFavorites(updated);
  };

  // Search commit trigger (adds to recent searches)
  const commitSearchQuery = (query: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    const filtered = recentSearches.filter((s) => s.toLowerCase() !== cleanQuery.toLowerCase());
    const updated = [cleanQuery, ...filtered].slice(0, 5);
    saveRecentSearches(updated);
  };

  // Trigger search on typing (with debounce check if needed, or instant!)
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    commitSearchQuery(searchQuery);
  };

  const selectRecentSearch = (search: string) => {
    setSearchQuery(search);
    commitSearchQuery(search);
    searchInputRef.current?.focus();
    showToast(`Searching for "${search}"`, "info");
  };

  const clearRecentSearches = () => {
    saveRecentSearches([]);
    showToast("Search history cleared", "info");
  };

  // Tag click handler
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    commitSearchQuery(tag);
    showToast(`Filtering tag: #${tag}`, "info");
  };

  // Add Resource handler
  const handleAddResource = (newRes: Omit<Resource, "id" | "clicks">) => {
    const resourceToAdd: Resource = {
      ...newRes,
      id: Date.now().toString(),
      clicks: 0
    };
    saveResources([resourceToAdd, ...resources]);
    setIsAddOpen(false);
    showToast(`"${resourceToAdd.title}" bookmark created!`, "success");
  };

  // Reset all directory resources back to default
  const handleResetDefaults = () => {
    if (confirm("Are you sure you want to reset the directory to the default assets list? This deletes custom items.")) {
      saveResources(DEFAULT_RESOURCES);
      saveFavorites([]);
      setSearchQuery("");
      setSelectedCategory("All");
      setShowOnlyFavorites(false);
      showToast("Directory reset to default index", "info");
    }
  };

  // Filter & Search Logic with Score Matrix
  const filteredAndSortedResources = resources
    .filter((res) => {
      // 1. Favorites check
      if (showOnlyFavorites && !favorites.includes(res.id)) {
        return false;
      }

      // 2. Category check
      if (selectedCategory !== "All" && res.category !== selectedCategory) {
        return false;
      }

      // 3. Search Query check
      if (!searchQuery.trim()) {
        return true;
      }

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchTags = res.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = res.category.toLowerCase().includes(q);

      return matchTitle || matchDesc || matchTags || matchCat;
    })
    .map((res) => {
      // Calculate search relevance score
      if (!searchQuery.trim()) {
        return { ...res, score: 0 };
      }

      const q = searchQuery.toLowerCase().trim();
      let score = 0;

      if (res.title.toLowerCase() === q) score += 20;
      else if (res.title.toLowerCase().startsWith(q)) score += 10;
      else if (res.title.toLowerCase().includes(q)) score += 5;

      res.tags.forEach((tag) => {
        if (tag.toLowerCase() === q) score += 12;
        else if (tag.toLowerCase().includes(q)) score += 6;
      });

      if (res.description.toLowerCase().includes(q)) score += 3;
      if (res.category.toLowerCase() === q) score += 8;

      return { ...res, score };
    })
    .sort((a, b) => {
      // Sort logic
      if (sortOption === "relevance" && searchQuery.trim()) {
        // Sort by search score first
        if (b.score !== a.score) {
          return b.score - a.score;
        }
      }

      if (sortOption === "popular") {
        return b.clicks - a.clicks;
      }

      if (sortOption === "alphabetical") {
        return a.title.localeCompare(b.title);
      }

      // Default fallback (custom items first, or highest clicks if score matches)
      if (b.clicks !== a.clicks) {
        return b.clicks - a.clicks;
      }
      return b.id.localeCompare(a.id);
    });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16 relative">
      
      {/* Toast Notifier */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl max-w-sm w-full border border-slate-800"
          >
            {toast.type === "success" && (
              <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                <Check className="w-4 h-4" />
              </div>
            )}
            {toast.type === "info" && (
              <div className="p-1 rounded bg-blue-500/10 text-blue-400">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            {toast.type === "error" && (
              <div className="p-1 rounded bg-rose-500/10 text-rose-400">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
            <p className="text-xs font-semibold leading-none">{toast.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <header className="border-b border-slate-200/60 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
              Search Portal
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              A minimalist, highly responsive index of curated utilities, tools, learning platforms, and design inspiration.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Bookmark
            </button>
            <button
              onClick={handleResetDefaults}
              className="p-2 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all"
              title="Reset to initial default list"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 mt-8">
        
        {/* Stats Section */}
        <StatsBanner resources={resources} favoriteCount={favorites.length} />

        {/* Central Search Box Container */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 md:p-6 mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title, description, category or tag..."
              className="w-full text-base pl-11 pr-24 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all text-slate-800 placeholder-slate-400"
            />
            
            <div className="absolute right-3 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="hidden sm:inline-flex items-center text-[10px] font-bold text-slate-400 border border-slate-200 bg-white px-1.5 py-0.5 rounded-md shadow-2xs pointer-events-none">
                /
              </span>
              <button
                type="submit"
                className="hidden sm:block text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Category Tab Filters */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-5 flex-wrap gap-4">
            <div className="flex flex-wrap gap-1 md:gap-1.5">
              {["All", ...CATEGORIES].map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = cat === "All" 
                  ? resources.length 
                  : resources.filter(r => r.category === cat).length;
                
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs font-medium px-3.5 py-2 rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    {cat}
                    <span className={`text-[10px] font-bold rounded-md px-1.5 py-0.5 ${
                      isSelected 
                        ? "bg-white/25 text-white" 
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Favorite Filter Toggle */}
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`text-xs font-medium px-4 py-2 rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer ${
                showOnlyFavorites
                  ? "bg-rose-50 text-rose-700 border-rose-200 shadow-xs"
                  : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <BookMarked className={`w-3.5 h-3.5 ${showOnlyFavorites ? "text-rose-600 fill-rose-600" : ""}`} />
              Saved Favorites
              <span className={`text-[10px] font-bold rounded px-1.5 py-0.2 ${
                showOnlyFavorites ? "bg-rose-100/80" : "bg-slate-100"
              }`}>
                {favorites.length}
              </span>
            </button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 flex-wrap">
              <span className="font-semibold text-slate-500">History:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => selectRecentSearch(search)}
                    className="hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/40 bg-slate-50 px-2 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {search}
                  </button>
                ))}
              </div>
              <button
                onClick={clearRecentSearches}
                className="text-slate-400 hover:text-slate-600 hover:underline ml-auto font-medium"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Prompt/Trending suggestions */}
          {recentSearches.length === 0 && (
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 flex-wrap">
              <span className="font-medium">Trending searches:</span>
              {["Tailwind", "React", "Icons", "Excalidraw"].map((item) => (
                <button
                  key={item}
                  onClick={() => selectRecentSearch(item)}
                  className="hover:text-indigo-600 hover:underline cursor-pointer"
                >
                  #{item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toolbar Control Bar */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              SHOWING <span className="text-slate-800 font-bold tabular-nums">{filteredAndSortedResources.length}</span> MATCHES 
              {selectedCategory !== "All" && ` IN ${selectedCategory.toUpperCase()}`}
              {showOnlyFavorites && " (FAVORITES ONLY)"}
              {searchQuery && ` FOR "${searchQuery.toUpperCase()}"`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400">SORT BY</span>
              <div className="relative inline-block text-left">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50 cursor-pointer focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                >
                  <option value="relevance">Relevance</option>
                  <option value="popular">Popularity (Visits)</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Layout Toggle Button Grid/List */}
            <div className="flex items-center border border-slate-200 bg-white p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-slate-900 text-white shadow-xs" : "text-slate-400 hover:text-slate-700"
                }`}
                title="Grid layout"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-slate-900 text-white shadow-xs" : "text-slate-400 hover:text-slate-700"
                }`}
                title="List layout"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Custom Resource Form Inline/Modal Drawer */}
        <AnimatePresence>
          {isAddOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setIsAddOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full max-w-lg"
              >
                <AddResourceForm 
                  onAdd={handleAddResource} 
                  onClose={() => setIsAddOpen(false)}
                  prepopulatedTitle={searchQuery}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty States */}
        {filteredAndSortedResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200/80 text-center"
          >
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-4">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No matching resources found</h3>
            <p className="text-sm text-slate-500 mt-1.5 max-w-sm">
              We couldn't find anything matching your filters or query. Try refining your keywords or clear your active filters.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setShowOnlyFavorites(false);
                  showToast("Cleared active filters", "info");
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
              
              {searchQuery && (
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Add custom bookmark for "{searchQuery}"
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Resources Cards Grid Canvas */}
        {filteredAndSortedResources.length > 0 && (
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                : "flex flex-col gap-3.5"
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedResources.map((res) => (
                <div key={res.id} className="h-full">
                  <ResourceCard
                    resource={res}
                    isFavorite={favorites.includes(res.id)}
                    viewMode={viewMode}
                    onToggleFavorite={handleToggleFavorite}
                    onTagClick={handleTagClick}
                    onOpen={handleOpenResource}
                  />
                </div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </main>

      {/* Footer Details */}
      <footer className="max-w-6xl mx-auto px-4 md:px-6 mt-16 text-center text-xs text-slate-400/80 font-medium">
        <p>Built with React, Tailwind CSS, and Lucide Icons.</p>
        <p className="mt-1">
          Press <kbd className="font-bold border border-slate-200 bg-white px-1 py-0.5 rounded-md shadow-3xs">[/]</kbd> key to instantly search resources.
        </p>
      </footer>

    </div>
  );
}
