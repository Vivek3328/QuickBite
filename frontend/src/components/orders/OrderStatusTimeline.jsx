import {
  ORDER_TIMELINE_STEPS,
  ORDER_STATUS,
  getOrderStatusClasses,
} from "@/constants/orderStatus";

function normalizeHistory(order) {
  if (order.statusHistory?.length) {
    return order.statusHistory.map((h) => ({
      status: h.status,
      at: h.at ? new Date(h.at) : null,
    }));
  }
  return [{ status: order.status, at: order.dateOrdered ? new Date(order.dateOrdered) : null }];
}

export function OrderStatusTimeline({ order }) {
  if (order.status === ORDER_STATUS.cancelled) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-800">
        This order was cancelled.
      </div>
    );
  }

  const history = normalizeHistory(order);
  const historyByStatus = new Map(history.map((h) => [h.status, h]));
  const curIdx = ORDER_TIMELINE_STEPS.indexOf(order.status);

  return (
    <ol className="relative space-y-0 border-l-2 border-ink-200 pl-4">
      {ORDER_TIMELINE_STEPS.map((step) => {
        const hit = historyByStatus.get(step);
        const stepIdx = ORDER_TIMELINE_STEPS.indexOf(step);
        const isDone = curIdx >= 0 && stepIdx <= curIdx;
        const isCurrent = curIdx >= 0 && stepIdx === curIdx;

        return (
          <li key={step} className="relative pb-6 last:pb-0">
            <span
              className={`absolute -left-[21px] top-1.5 flex h-3 w-3 rounded-full ring-4 ring-white ${
                isDone ? "bg-brand-600" : "bg-ink-200"
              }`}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span
                className={`text-sm font-semibold ${
                  isCurrent ? "text-brand-800" : isDone ? "text-ink-900" : "text-ink-400"
                }`}
              >
                {step}
              </span>
              {hit?.at ? (
                <time className="text-xs tabular-nums text-ink-500" dateTime={hit.at.toISOString()}>
                  {hit.at.toLocaleString()}
                </time>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getOrderStatusClasses(
        status
      )}`}
    >
      {status}
    </span>
  );
}
