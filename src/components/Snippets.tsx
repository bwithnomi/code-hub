"use client";

import { getAllSnippets, getMySnippets } from "@/actions/snippets.action";
import { BaseSnippet } from "@/db/schema";
import React, { useEffect, useState, useTransition } from "react";
import SnippetCardSkeleton from "./SnippetCardSkeleton";
import { toast, Toaster } from "sonner";
import SnippetCard from "./SnippetCard";

const Snippets = () => {
  const [snippets, setSnippets] = useState<BaseSnippet[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const getLanguages = (snippet: BaseSnippet) => {
    const newLanguages = snippet.files?.map((i) => {
      return i.language;
    });
    let netSet = new Set(newLanguages);
    return [...netSet];
  };

  const deleteSingleSnippet = async (id: number) => {
    let tmpSnippets = [...snippets!];
    tmpSnippets = tmpSnippets.filter((i) => {
      return i.id != id;
    });
    setSnippets(tmpSnippets);
    toast.info("Snippet deleted");
  };

  useEffect(() => {
    startTransition(async () => {
      const result = await getMySnippets();
      setSnippets(result.data);
    });
  }, []);

  if (isPending || !snippets) {
    return (
      <div className="grid gap-4 grid-cols-3">
        <SnippetCardSkeleton />
        <SnippetCardSkeleton />
        <SnippetCardSkeleton />
      </div>
    );
  }
  return (
    <div className="">
      <Toaster position="top-right" />
      {snippets.length > 0 ? (
        <div className="grid gap-4 grid-cols-3">
          {snippets &&
            snippets?.map((snippet) => (
              <SnippetCard
                snippet={snippet}
                onDelete={(val) => deleteSingleSnippet(val)}
                key={snippet.shareId}
              ></SnippetCard>
            ))}
        </div>
      ) : (
        <div className="">
          <p className="font-bold text-red-500">No Snippets Yet! 🥹</p>
        </div>
      )}
    </div>
  );
};

export default Snippets;
