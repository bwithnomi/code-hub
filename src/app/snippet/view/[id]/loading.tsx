export default function Loading() {
  return (
    <div className="flex items-start justify-center bg-slate-200 dark:bg-slate-800 h-screen p-8 overflow-scroll">
      <div className="w-3xl py-8 shadow-2xl px-8 rounded-3xl bg-rose-100 dark:bg-rose-300 animate-pulse">
        <div className="h-7 bg-slate-300 dark:bg-slate-600 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded w-1/4 mx-auto mb-8"></div>
        <div className="space-y-4">
          <div className="h-5 bg-slate-300 dark:bg-slate-600 rounded w-1/3"></div>
          <div className="bg-slate-300 dark:bg-slate-600 rounded-2xl h-64"></div>
        </div>
      </div>
    </div>
  );
}

