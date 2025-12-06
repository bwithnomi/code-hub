"use client";

import { Input } from "@/components/ui/input";
import { codingLanguages, languageGroups } from "@/app/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useTransition } from "react";
import { searchSnippets } from "@/actions/snippets.action";
import { BaseSnippet } from "@/db/schema";
import SnippetCardSkeleton from "@/components/SnippetCardSkeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Search, X, Lock, Globe, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/lib/debounce";
import { useUser } from "@clerk/nextjs";

const getLanguages = (snippet: BaseSnippet) => {
  const newLanguages = snippet.files?.map((i) => {
    return i.language;
  });
  let netSet = new Set(newLanguages);
  return [...netSet];
};

type SearchResultSnippet = BaseSnippet & {
  currentUserId?: number;
};

interface SearchSnippetProps {
  initialQuery?: string;
  initialPublicCount: number;
  initialMyCount: number;
}

const SearchSnippet = ({ initialQuery = "", initialPublicCount, initialMyCount }: SearchSnippetProps) => {
  const { user, isLoaded } = useUser();
  const [searching, startSearching] = useTransition();
  const [snippets, setSnippets] = useState<SearchResultSnippet[]>([]);
  const [publicSnippetCount] = useState<number>(initialPublicCount);
  const [mySnippetCount] = useState<number>(initialMyCount);
  const [search, setSearch] = useState<string>(initialQuery);
  const debouncedSearch = useDebounce(search, 500);
  const [language, setLanguage] = useState<string>("any");
  const [scope, setScope] = useState<"my" | "public" | "all">("all");
  const [hasSearched, setHasSearched] = useState<boolean>(!!initialQuery);

  // Update search when initialQuery changes (from URL params)
  useEffect(() => {
    if (initialQuery !== search) {
      setSearch(initialQuery);
      if (initialQuery) {
        setHasSearched(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Perform search when debounced search, language, or scope changes
  useEffect(() => {
    startSearching(async () => {
      const result = await searchSnippets(debouncedSearch, language, scope);
      if (result.data) {
        setSnippets(result.data as SearchResultSnippet[]);
        setHasSearched(true);
      }
    });
  }, [debouncedSearch, language, scope]);

  const clearSearch = () => {
    setSearch("");
    setLanguage("any");
    setScope("all");
  };

  const hasActiveFilters = search.trim() || language !== "any" || scope !== "all";

  const getScopeLabel = () => {
    switch (scope) {
      case "my":
        return "My Snippets";
      case "public":
        return "Public Snippets";
      case "all":
        return "All Snippets";
    }
  };

  const getScopeIcon = () => {
    switch (scope) {
      case "my":
        return <User className="h-4 w-4" />;
      case "public":
        return <Globe className="h-4 w-4" />;
      case "all":
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Fixed search and filter section */}
      <div className="flex flex-col gap-4 sticky top-0 z-10 bg-background pb-4 pt-2 -mt-2">
        {/* Scope selector */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={scope === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setScope("all")}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            All
          </Button>
          {isLoaded && user && (
            <Button
              variant={scope === "my" ? "default" : "outline"}
              size="sm"
              onClick={() => setScope("my")}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              My Snippets
            </Button>
          )}
          <Button
            variant={scope === "public" ? "default" : "outline"}
            size="sm"
            onClick={() => setScope("public")}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            Public
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by title or share-id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="w-full sm:w-[200px]">
            <Select
              onValueChange={(value) => setLanguage(value)}
              value={language}
              disabled={searching}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by language" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                <SelectGroup>
                  <SelectLabel className="text-xs font-semibold text-muted-foreground px-2 py-2">
                    All Languages
                  </SelectLabel>
                  <SelectItem value="any" className="pl-4">Any Language</SelectItem>
                </SelectGroup>
                {Object.entries(languageGroups).map(([groupName, languages]) => (
                  <SelectGroup key={groupName}>
                    <SelectLabel className="text-xs font-semibold text-muted-foreground px-2 py-2">
                      {groupName}
                    </SelectLabel>
                    {languages.map((lang) => (
                      <SelectItem value={lang} key={lang} className="pl-4">
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearSearch}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable results section */}
      <div>
        {/* Results count */}
      {hasSearched && !searching && (
        <div className="text-sm text-muted-foreground">
          {snippets.length === 0 ? (
            <p>No snippets found matching your search.</p>
          ) : (
            <div className="flex items-center gap-2">
              <span>
                Found {snippets.length} {snippets.length === 1 ? "snippet" : "snippets"}
                {search.trim() && ` for "${search}"`}
                {language !== "any" && ` in ${language}`}
              </span>
              <span className="text-xs">•</span>
              <span className="flex items-center gap-1">
                {getScopeIcon()}
                {getScopeLabel()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {searching ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          <SnippetCardSkeleton />
          <SnippetCardSkeleton />
          <SnippetCardSkeleton />
        </div>
      ) : !searching && hasSearched && snippets.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearSearch}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        // Results grid
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {snippets.map((snippet) => {
            // Check if snippet belongs to current user by comparing userId with currentUserId
            const currentUserId = (snippet as any).currentUserId;
            const isMySnippet = isLoaded && user && currentUserId !== undefined && snippet.userId === currentUserId;
            const isPublic = snippet.visibility === "public";
            
            return (
              <Card
                className="col-span-1 w-full min-w-0 hover:shadow-lg transition-shadow overflow-hidden"
                key={snippet.shareId}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 overflow-hidden">
                    <CardTitle 
                      className="text-lg flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap" 
                      title={snippet.title}
                    >
                      {snippet.title}
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isMySnippet && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1" title="My snippet">
                          <User className="h-3 w-3" />
                        </span>
                      )}
                      {isPublic ? (
                        <span className="text-xs text-muted-foreground flex items-center gap-1" title="Public">
                          <Globe className="h-3 w-3" />
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground flex items-center gap-1" title="Private">
                          <Lock className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Languages:
                    </p>
                    <p className="text-sm">
                      {getLanguages(snippet)?.length > 0 ? (
                        getLanguages(snippet)?.map((i, index) => {
                          return index === 0 ? (
                            <span key={i} className="font-medium">{i}</span>
                          ) : (
                            <span key={i}>, <span className="font-medium">{i}</span></span>
                          );
                        })
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Files:
                    </p>
                    <p className="text-sm">
                      {snippet.files?.length || 0} {snippet.files?.length === 1 ? "file" : "files"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {new Date(snippet.updatedAt).toLocaleDateString()}
                </p>
                <Button size="sm" asChild>
                  <Link
                    href={`/snippet/view/${snippet.shareId}`}
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <span>View</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            );
          })}
        </div>
      )}

      {/* Initial state - show total count */}
      {!hasSearched && !searching && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Search Snippets</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            {scope === "all" && (
              <>
                <p>
                  {isLoaded && user && mySnippetCount > 0 && (
                    <span>{mySnippetCount} of your {mySnippetCount === 1 ? "snippet" : "snippets"}</span>
                  )}
                  {isLoaded && user && mySnippetCount > 0 && publicSnippetCount > 0 && " • "}
                  {publicSnippetCount > 0 && (
                    <span>{publicSnippetCount} public {publicSnippetCount === 1 ? "snippet" : "snippets"}</span>
                  )}
                </p>
              </>
            )}
            {scope === "my" && (
              <p>
                {mySnippetCount > 0
                  ? `You have ${mySnippetCount} ${mySnippetCount === 1 ? "snippet" : "snippets"}`
                  : "You don't have any snippets yet"}
              </p>
            )}
            {scope === "public" && (
              <p>
                {publicSnippetCount > 0
                  ? `Browse ${publicSnippetCount} public ${publicSnippetCount === 1 ? "snippet" : "snippets"}`
                  : "No public snippets available"}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Start typing to search by title or share-id, or filter by language
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default SearchSnippet;
