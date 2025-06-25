import SearchSnippet from './SearchSnippet'

const page = () => {
  return (
    <div className='px-6 py-6'>
        <p className="font-bold text-lg">Search Snippets</p>
        <div className="mt-8">
            <SearchSnippet/>
        </div>
    </div>
  )
}

export default page