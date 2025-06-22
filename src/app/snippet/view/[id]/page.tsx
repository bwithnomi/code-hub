import { viewSnippetByShareId } from "@/actions/snippets.action";
import Image from "next/image";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const snippet = await viewSnippetByShareId(id);
  return (
    <div className="flex items-start justify-center bg-slate-200 h-screen p-8 overflow-scroll">
      {snippet ? (
        <div className="w-3xl py-8 shadow-2xl px-4 rounded-3xl bg-amber-100">
          <p className="text-center font-bold text-xl">{snippet?.title}</p>
          <div className="">
            {snippet?.files.map((f) => (
              <div className="mt-4" key={f.id}>
                <p>
                  <b>Language:</b> {f.language}
                </p>
                <div className="bg-black text-white p-4 rounded-2xl mt-2">
                  <pre>
                    <code lang={f.language}>{f.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-3xl py-12 shadow-2xl px-8 rounded-3xl bg-amber-100 flex flex-col items-center justify-center gap-10">
          <p className="text-center font-bold text-xl">Oops! The snippet you're looking for either doesn't exist or hasn't been shared publicly.</p>
          <Image src="/private_snippet.svg" width={400} height={400} alt=""></Image>
        </div>
      )}
    </div>
  );
};

export default page;
