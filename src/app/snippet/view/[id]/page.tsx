import { getSnippetByShareId } from '@/actions/snippets.action'
import React from 'react'

const page = async ({params}:{params: Promise<{ id: string }>}) => {
    const {id} = await params;
    const snippet = await getSnippetByShareId(id);
  return (
    <div className='flex items-start justify-center bg-slate-200 h-screen p-8 overflow-scroll'>
        <div className="w-3xl py-8 shadow-2xl px-4 rounded-3xl bg-amber-100">
            <p className='text-center font-bold text-xl'>{snippet?.title}</p>
            <div className="">
                {
                    snippet?.files.map(f => (
                        <div className="mt-4" key={f.id}>
                            <p><b>Language:</b> {f.language}</p>
                            <div className="bg-black text-white p-4 rounded-2xl mt-2">
                                <pre><code lang={f.language}>{f.code}</code></pre>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default page