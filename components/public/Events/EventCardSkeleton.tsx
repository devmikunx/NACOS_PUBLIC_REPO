export function EventCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-tr-[2.5rem] rounded-bl-[2.5rem] bg-white border border-[#168706]/10 animate-pulse"
      aria-hidden="true"
    >
      <div className="w-full aspect-[16/10] bg-[#168706]/10" />
      <div className="p-6 space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
        <div className="pt-4 mt-2 border-t border-[#168706]/10 space-y-2">
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
          <div className="h-3 w-1/3 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}
