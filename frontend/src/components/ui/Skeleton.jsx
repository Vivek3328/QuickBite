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

export function RestaurantCardSkeleton() {
  return (
    <div className="surface-card flex animate-pulse overflow-hidden">
      <div className="h-36 w-32 shrink-0 bg-ink-200 sm:h-40 sm:w-36" />
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
        <div>
          <div className="flex justify-between gap-2">
            <div className="h-5 w-3/4 rounded-lg bg-ink-200" />
            <div className="h-6 w-14 shrink-0 rounded-full bg-ink-100" />
          </div>
          <div className="mt-3 h-4 w-1/2 rounded bg-ink-100" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="h-4 w-24 rounded bg-ink-100" />
          <div className="h-4 w-16 rounded bg-ink-100" />
          <div className="h-4 w-28 rounded bg-ink-100" />
        </div>
      </div>
    </div>
  );
}

export function MenuPageHeroSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-ink-100/80 bg-ink-200 shadow-card">
      <div className="aspect-[21/9] min-h-[160px] sm:aspect-[3/1] sm:min-h-[200px]" />
      <div className="space-y-3 bg-white/90 p-6 sm:p-8">
        <div className="h-9 w-2/3 max-w-md rounded-xl bg-ink-200" />
        <div className="h-4 w-1/2 max-w-xs rounded-lg bg-ink-100" />
        <div className="h-4 w-full max-w-lg rounded-lg bg-ink-100" />
      </div>
    </div>
  );
}

export function MenuItemRowSkeleton() {
  return (
    <div className="surface-card flex animate-pulse gap-4 overflow-hidden p-4 sm:p-5">
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
        <div className="h-5 w-4/5 rounded-lg bg-ink-200" />
        <div className="h-3.5 w-full rounded bg-ink-100" />
        <div className="h-3.5 w-5/6 rounded bg-ink-100" />
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="h-7 w-20 rounded-lg bg-ink-200" />
          <div className="h-10 w-24 rounded-full bg-ink-200" />
        </div>
      </div>
      <div className="h-28 w-28 shrink-0 rounded-2xl bg-ink-200 sm:h-32 sm:w-32" />
    </div>
  );
}

/** Partner dashboard menu rows (thumb + meta + edit action). */
export function PartnerMenuRowSkeleton() {
  return (
    <div className="surface-card flex animate-pulse items-center gap-4 p-4 sm:gap-5 sm:p-5">
      <div className="h-20 w-20 shrink-0 rounded-2xl bg-ink-200 sm:h-24 sm:w-24" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-5 w-4/5 max-w-xs rounded-lg bg-ink-200" />
        <div className="h-3.5 w-full max-w-md rounded bg-ink-100" />
        <div className="h-3.5 w-3/4 max-w-sm rounded bg-ink-100" />
      </div>
      <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
        <div className="h-6 w-16 rounded-md bg-ink-200" />
        <div className="h-9 w-20 rounded-xl bg-ink-200" />
      </div>
    </div>
  );
}

export function KitchenOrderCardSkeleton() {
  return (
    <div className="surface-card h-full min-h-[280px] animate-pulse overflow-hidden border-l-4 border-ink-200">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-100 p-4 sm:p-5">
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-ink-200" />
          <div className="h-5 w-40 rounded-lg bg-ink-100" />
        </div>
        <div className="h-7 w-24 rounded-full bg-ink-200" />
      </div>
      <div className="h-2 bg-ink-100">
        <div className="h-full w-1/2 bg-ink-200" />
      </div>
      <div className="space-y-3 p-4 sm:p-5">
        <div className="h-4 w-full max-w-md rounded bg-ink-100" />
        <div className="h-4 w-3/4 rounded bg-ink-100" />
        <div className="flex gap-2 pt-2">
          <div className="h-10 flex-1 rounded-xl bg-ink-200" />
          <div className="h-10 w-24 rounded-xl bg-ink-200" />
        </div>
      </div>
    </div>
  );
}
