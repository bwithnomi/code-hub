"use client";

import { BaseSnippet } from "@/db/schema";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import SnippetCard from "./SnippetCard";
import { useRouter } from "next/navigation";

interface SnippetsProps {
  initialSnippets: BaseSnippet[] | null;
}

const Snippets = ({ initialSnippets }: SnippetsProps) => {
  const [snippets, setSnippets] = useState<BaseSnippet[] | null>(initialSnippets);
  const router = useRouter();

  const deleteSingleSnippet = async (id: number) => {
    let tmpSnippets = [...snippets!];
    tmpSnippets = tmpSnippets.filter((i) => {
      return i.id != id;
    });
    setSnippets(tmpSnippets);
    // Refresh the page to update the snippet count and enable/disable the "Create New" button
    router.refresh();
  };

  if (!snippets) {
    return (
      <div className="">
        <p className="font-bold text-red-500">No Snippets Yet! 🥹</p>
      </div>
    );
  }

  return (
    <div className="">
      <Toaster position="top-right" />
      {snippets.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-muted-foreground">
              No Snippets Yet! 🥹
            </p>
            <p className="text-sm text-muted-foreground">
              Create your first snippet to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Snippets;
