export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-72 bg-gray-800 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
              <div className="h-12 bg-gray-800 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
        <div className="card p-6">
          <div className="h-full min-h-[400px] bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
