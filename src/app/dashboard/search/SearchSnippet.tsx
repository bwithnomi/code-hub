"use client";

import { Input } from "@/components/ui/input";
import { codingLanguages } from "@/app/constants";
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
import {
  getAllSnippets,
  getSearchableSnippetCount,
} from "@/actions/snippets.action";
import { BaseSnippet } from "@/db/schema";
import SnippetCardSkeleton from "@/components/SnippetCardSkeleton";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDebounce } from "@/lib/debounce";

const getLanguages = (snippet: BaseSnippet) => {
  const newLanguages = snippet.files?.map((i) => {
    return i.language;
  });
  let netSet = new Set(newLanguages);
  return [...netSet];
};
const SearchSnippet = () => {
  const [searching, startSearching] = useTransition();
  const [snippets, setSnippets] = useState<BaseSnippet[]>([]);
  const [snippetCount, setSnippetCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [loading, startLoading] = useTransition();
  const [language, setLanguage] = useState<string>("any");

  // Optional effect when debounced value changes
  useEffect(() => {
    if (debouncedSearch) {
      console.log("Debounced value:", debouncedSearch);
      // Trigger API call or update UI here
    }
  }, [debouncedSearch]);

  useEffect(() => {
    startLoading(async () => {
      const [res, snippetCount] = await Promise.all([
        getAllSnippets(),
        getSearchableSnippetCount(),
      ]);
      console.log((await snippetCount.data.count).toString());

      setSnippetCount(parseInt((await snippetCount.data.count).toString()));
      setSnippets(res);
    });
  }, []);

  return (
    <div>
      <div className="flex gap-4">
        <div className="w-[400]">
          <Input
            placeholder="Search by title or share-id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="">
          <Select
            onValueChange={(value) => setLanguage(value)}
            defaultValue={language}
            disabled={searching}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Change Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Language</SelectLabel>
                <SelectItem value="any">Any Lang</SelectItem>
                {codingLanguages.map((lang) => (
                  <SelectItem value={lang} key={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 grid-cols-3 mt-8">
          <SnippetCardSkeleton />
          <SnippetCardSkeleton />
          <SnippetCardSkeleton />
        </div>
      ) : (
        <div className="">
          <div className="grid gap-4 grid-cols-3 mt-8">
            {snippets.map((snippet) => (
              <Card className="col-span-1 gap-2" key={snippet.shareId}>
                <CardHeader>
                  <CardTitle className="w-full truncate">
                    {snippet.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Languages:{" "}
                    {getLanguages(snippet)?.map((i, index) => {
                      return index == 0 ? i : ", " + i;
                    })}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between cursor-pointer">
                  <p className="text-sm">
                    Last Edited:{" "}
                    <span className="font-bold text-slate-500 text-sm">
                      {snippet.updatedAt.toDateString()}
                    </span>
                  </p>
                  <Button>
                    <Link
                      href={`/snippet/view/${snippet.shareId}`}
                      target="blank"
                    >
                      <ExternalLink />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSnippet;
