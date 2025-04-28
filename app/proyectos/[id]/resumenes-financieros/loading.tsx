export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-700 rounded-md mb-6 animate-pulse"></div>
      <div className="h-6 w-full max-w-md bg-gray-200 dark:bg-zinc-700 rounded-md mb-8 animate-pulse"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm animate-pulse">
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded-md mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-700 rounded-md mb-6"></div>
            <div className="h-8 w-full bg-gray-200 dark:bg-zinc-700 rounded-md mb-4"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-zinc-700 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
