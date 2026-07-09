function SkeletonBar({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={`skeleton-pulse rounded-lg bg-navy/10 ${className ?? ""}`}
    />
  );
}

export default function PublicLoading() {
  return (
    <div className="bg-cream">
      <div className="h-[45vh] bg-navy/10 skeleton-pulse" />

      <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <SkeletonBar className="h-4 w-32" />
          <SkeletonBar className="h-10 w-2/3 max-w-xl" />
          <SkeletonBar className="h-5 w-full max-w-2xl" />
          <SkeletonBar className="h-5 w-5/6 max-w-xl" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBar key={index} className="h-28" />
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <SkeletonBar className="aspect-[4/3]" />
          <div className="space-y-4">
            <SkeletonBar className="h-4 w-28" />
            <SkeletonBar className="h-8 w-3/4" />
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
