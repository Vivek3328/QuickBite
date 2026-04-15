export function SkeletonCard() {
  return (
    <div className="surface-card h-full w-full max-w-none animate-pulse overflow-hidden">
      <div className="aspect-[4/3] w-full bg-ink-200" />
      <div className="p-5">
        <div className="h-6 w-2/3 rounded-lg bg-ink-200" />
        <div className="mt-3 h-4 w-1/2 rounded bg-ink-100" />
        <div className="mt-6 flex items-center justify-between">
          <div className="h-10 w-28 rounded-xl bg-ink-200" />
          <div className="h-5 w-16 rounded bg-ink-100" />
        </div>
      </div>
    </div>
  );
}
