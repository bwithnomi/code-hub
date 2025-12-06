import Snippets from "@/app/dashboard/snippets/Snippets";
import { getMySnippetCount, getMySnippets } from "@/actions/snippets.action";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const page = async () => {
  // Fetch both data in parallel on the server
  const [snippetCountResult, snippetsResult] = await Promise.all([
    getMySnippetCount(),
    getMySnippets(),
  ]);

  const snippetCount = snippetCountResult.data?.count || 0;
  const maxSnippets = snippetCountResult.data?.maxSnippets || Infinity;
  const isAtLimit = snippetCount >= maxSnippets;
  const snippets = snippetsResult.data || [];

  return (
    <div className="px-6 py-6 ">
      <div className="flex justify-between items-center">
        <p className="font-bold text-lg">My Snippets</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button 
                  className="flex items-center gap-2" 
                  asChild={!isAtLimit}
                  disabled={isAtLimit}
                >
                  {!isAtLimit ? (
                    <Link href="/dashboard/snippets/new">
                      <Plus></Plus>
                      <span className="inline">Create New</span>
                    </Link>
                  ) : (
                    <>
                      <Plus></Plus>
                      <span className="inline">Create New</span>
                    </>
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            {isAtLimit && (
              <TooltipContent>
                <p>Free tier limit reached. You can create up to {maxSnippets} snippets. Upgrade to create more.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-8 ">
        <Snippets initialSnippets={snippets} />
      </div>
    </div>
  );
};

export default page;
