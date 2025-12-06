import SearchSnippet from './SearchSnippet'
import { Search } from 'lucide-react'
import { getSearchableSnippetCount, getMySnippetCount } from '@/actions/snippets.action'

const page = async ({
  searchParams,
}: {
  searchParams: { q?: string }
}) => {
  const initialQuery = (await searchParams)?.q || "";

  // Fetch counts in parallel on the server
  const [publicCountResult, myCountResult] = await Promise.all([
    getSearchableSnippetCount(),
    getMySnippetCount(),
  ]);

  const initialPublicCount = publicCountResult.data?.count || 0;
  const initialMyCount = myCountResult.data?.count || 0;

  return (
    <div className='h-full flex flex-col max-w-7xl mx-auto w-full'>
      {/* Fixed header section */}
      <div className="px-4 sm:px-6 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Search Snippets</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Discover and explore public code snippets from the community
        </p>
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
        <SearchSnippet 
          initialQuery={initialQuery} 
          initialPublicCount={initialPublicCount}
          initialMyCount={initialMyCount}
        />
      </div>
    </div>
  )
}

export default page